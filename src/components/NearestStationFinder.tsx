"use client";

import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  Compass,
  AlertCircle,
  Building2,
} from "lucide-react";
import { LegalCategoryId } from "@/lib/legal-knowledge";
import {
  calculateDistanceKm,
  getCategoryMapSearchQuery,
  HelpingStation,
  VERIFIED_HELPING_STATIONS,
} from "@/lib/helping-stations";

interface LiveOverpassPlace {
  id: string;
  name: string;
  typeLabel: string;
  lat: number;
  lng: number;
  distanceKm: number;
}

export default function NearestStationFinder({
  categoryId,
  authorityName,
  citizenCity,
}: {
  categoryId: LegalCategoryId;
  authorityName?: string;
  citizenCity?: string;
}) {
  const [locating, setLocating] = useState(false);
  const [permissionState, setPermissionState] = useState<
    "idle" | "granted" | "denied"
  >("idle");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [detectedArea, setDetectedArea] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [nearestStations, setNearestStations] = useState<
    (HelpingStation & { distanceKm: number })[]
  >([]);
  const [liveNearbyPlaces, setLiveNearbyPlaces] = useState<LiveOverpassPlace[]>(
    []
  );

  const mapMeta = getCategoryMapSearchQuery(categoryId);

  function requestUserLocation() {
    setErrorMessage("");
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setPermissionState("denied");
      setErrorMessage(
        "Geolocation is not supported by your browser. You can still open Google Maps below."
      );
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoords({ lat, lng });
        setPermissionState("granted");

        // 1. Rank verified helping stations for this legal problem by distance
        const matchingCategoryStations = VERIFIED_HELPING_STATIONS.filter((s) =>
          s.categories.includes(categoryId)
        );
        const pool =
          matchingCategoryStations.length > 0
            ? matchingCategoryStations
            : VERIFIED_HELPING_STATIONS;

        const ranked = pool
          .map((station) => ({
            ...station,
            distanceKm: calculateDistanceKm(lat, lng, station.lat, station.lng),
          }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 3);

        setNearestStations(ranked);

        // 2. Reverse-geocode user's area via OpenStreetMap Nominatim
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14`
          );
          if (revRes.ok) {
            const revData = await revRes.json();
            const addr = revData.address || {};
            const areaParts = [
              addr.suburb || addr.neighbourhood || addr.road,
              addr.city || addr.town || addr.county || addr.state_district,
              addr.state,
            ].filter(Boolean);
            if (areaParts.length > 0) {
              setDetectedArea(areaParts.join(", "));
            }
          }
        } catch {
          // ignore reverse geocoding network error
        }

        // 3. Query OpenStreetMap Overpass API for live nearby police stations / courts / govt offices within 12km
        try {
          const overpassFilter =
            categoryId === "police" || categoryId === "civil_criminal"
              ? `node["amenity"="police"](around:12000,${lat},${lng});way["amenity"="police"](around:12000,${lat},${lng});node["amenity"="courthouse"](around:12000,${lat},${lng});`
              : `node["amenity"="courthouse"](around:15000,${lat},${lng});node["office"="government"](around:15000,${lat},${lng});node["amenity"="police"](around:10000,${lat},${lng});`;

          const query = `[out:json][timeout:8];(${overpassFilter});out center 6;`;
          const ovRes = await fetch(
            `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
              query
            )}`
          );
          if (ovRes.ok) {
            const ovData = await ovRes.json();
            if (Array.isArray(ovData.elements)) {
              const places: LiveOverpassPlace[] = ovData.elements
                .map(
                  (el: {
                    id: number;
                    lat?: number;
                    lon?: number;
                    center?: { lat: number; lon: number };
                    tags?: Record<string, string>;
                  }) => {
                    const pLat = el.lat ?? el.center?.lat;
                    const pLng = el.lon ?? el.center?.lon;
                    const name =
                      el.tags?.["name:en"] || el.tags?.name || "";
                    if (!pLat || !pLng || !name) return null;
                    const amenity = el.tags?.amenity || el.tags?.office || "";
                    const typeLabel =
                      amenity === "police"
                        ? "Local Police Station"
                        : amenity === "courthouse"
                        ? "Court / Judicial Complex"
                        : "Government Facilitation Office";
                    return {
                      id: String(el.id),
                      name,
                      typeLabel,
                      lat: pLat,
                      lng: pLng,
                      distanceKm: calculateDistanceKm(lat, lng, pLat, pLng),
                    };
                  }
                )
                .filter(Boolean)
                .sort(
                  (a: LiveOverpassPlace, b: LiveOverpassPlace) =>
                    a.distanceKm - b.distanceKm
                )
                .slice(0, 4);
              setLiveNearbyPlaces(places);
            }
          }
        } catch {
          // ignore overpass errors
        }

        setLocating(false);
      },
      (err) => {
        setLocating(false);
        setPermissionState("denied");
        if (err.code === err.PERMISSION_DENIED) {
          setErrorMessage(
            "Location permission was denied. Please allow location access in your browser address bar, or use the direct Google Maps search button below."
          );
        } else {
          setErrorMessage(
            "Could not detect GPS coordinates automatically. You can still open the nearest helping station on Google Maps below."
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }

  const googleMapsNearbyUrl = coords
    ? `https://www.google.com/maps/search/${encodeURIComponent(
        `${authorityName || mapMeta.searchQuery}`
      )}/@${coords.lat},${coords.lng},13z`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${authorityName || mapMeta.searchQuery} ${citizenCity || "Pakistan"}`
      )}`;

  return (
    <div className="soft-card rounded-3xl p-6 space-y-4 border-2 border-teal-500/25">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-0.5 text-xs font-bold text-teal-800">
            <Compass className="h-3.5 w-3.5 text-teal-600" />
            Nearest Helping Station Locator • قریبی مددگار مرکز
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
            Where You Can Go in Person ({mapMeta.stationLabel})
          </h3>
          <p className="text-xs text-slate-600">
            Grant location permission so we can find the closest government
            helping station, police station, or regional office for your problem
            and guide you there with turn-by-turn directions.
          </p>
        </div>

        <button
          type="button"
          onClick={requestUserLocation}
          disabled={locating}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-3 text-xs sm:text-sm font-extrabold text-white shadow-md hover:from-teal-700 hover:to-emerald-700 disabled:opacity-50 shrink-0 transition"
        >
          <Navigation className="h-4 w-4" />
          <span>
            {locating
              ? "Detecting Your Location..."
              : permissionState === "granted"
              ? "Refresh My Location"
              : "Allow Location & Find Nearest Station"}
          </span>
        </button>
      </div>

      {errorMessage && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-medium">{errorMessage}</p>
            <a
              href={googleMapsNearbyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-800 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-900"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Nearest Helping Stations on Google Maps</span>
            </a>
          </div>
        </div>
      )}

      {permissionState === "granted" && coords && (
        <div className="space-y-4 pt-2 border-t border-slate-100">
          {/* Detected GPS Banner */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-emerald-50/80 border border-emerald-200 px-4 py-3 text-xs">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                Your Detected Location:{" "}
                {detectedArea
                  ? `${detectedArea} (${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E)`
                  : `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`}
              </span>
            </div>
            <a
              href={googleMapsNearbyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-extrabold text-teal-700 hover:underline"
            >
              <span>View All Nearby on Google Maps</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Live Nearby Local Stations from OpenStreetMap (if found within 12km) */}
          {liveNearbyPlaces.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-teal-700">
                Closest Local Stations Around Your Current GPS Position:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {liveNearbyPlaces.map((place) => {
                  const dirUrl = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${place.lat},${place.lng}`;
                  return (
                    <div
                      key={place.id}
                      className="rounded-2xl border border-teal-200 bg-teal-50/40 p-4 flex flex-col justify-between gap-2.5"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-extrabold text-slate-900">
                            {place.name}
                          </span>
                          <span className="rounded-full bg-teal-600 text-white px-2.5 py-0.5 text-[10px] font-bold shrink-0">
                            {place.distanceKm} km away
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-teal-700 mt-0.5">
                          {place.typeLabel}
                        </p>
                      </div>
                      <a
                        href={dirUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-600 px-3 py-2 text-xs font-bold text-white hover:bg-teal-700 transition"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        <span>Get Directions to This Station</span>
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Verified Regional Helping Stations for this Specific Legal Category */}
          <div className="space-y-2.5">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Corresponding Regional Helping Stations &amp; Grievance Offices:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {nearestStations.map((station, idx) => {
                const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${coords.lat},${coords.lng}&destination=${station.lat},${station.lng}`;
                return (
                  <div
                    key={station.id}
                    className={`rounded-2xl border p-4 space-y-2.5 transition ${
                      idx === 0
                        ? "border-emerald-400 bg-white shadow-sm"
                        : "border-slate-200 bg-slate-50/60"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Building2 className="h-4 w-4 text-teal-600 shrink-0" />
                          <h4 className="text-sm font-extrabold text-slate-900">
                            {station.name}
                          </h4>
                          {idx === 0 && (
                            <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-[10px] font-extrabold">
                              Closest Regional Center
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {station.officeType} •{" "}
                          <strong>{station.address}</strong>
                        </p>
                      </div>

                      <span className="rounded-xl bg-slate-900 text-white px-3 py-1 text-xs font-mono font-bold shrink-0">
                        {station.distanceKm} km
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-100/80 rounded-xl p-2.5 flex items-start gap-2">
                      <ShieldCheck className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>What to do here:</strong> {station.actionAdvice}
                      </span>
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <PhoneCall className="h-3.5 w-3.5 text-teal-600" />
                        Helpline: {station.helpline}
                      </span>

                      <a
                        href={directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-teal-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-teal-700 transition"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        <span>Open Google Maps Directions</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

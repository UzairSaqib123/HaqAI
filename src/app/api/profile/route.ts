import { NextRequest, NextResponse } from "next/server";
import {
  findCitizenProfile,
  getAllProfiles,
  saveCitizenProfile,
} from "@/lib/store";
import { CitizenProfile, generateHaqCitizenId } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const haqId = searchParams.get("haqId") || undefined;
  const email = searchParams.get("email") || undefined;
  const phone = searchParams.get("phone") || undefined;

  if (haqId || email || phone) {
    const profile = findCitizenProfile({ haqId, email, phone });
    return NextResponse.json({ profile });
  }

  const profiles = getAllProfiles();
  return NextResponse.json({
    profile: null,
    profiles,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      haqId,
      userId,
      email,
      fullName,
      cnic,
      phone,
      city,
      province,
      address,
      occupation,
      role,
    } = body;

    if (!fullName || !cnic || !phone || !city) {
      return NextResponse.json(
        {
          error:
            "Full Name, CNIC, Phone/WhatsApp Number, and City are required to create your HaqAI Citizen ID.",
        },
        { status: 400 }
      );
    }

    const existing = findCitizenProfile({ haqId, email });
    const finalHaqId = haqId || existing?.haqId || generateHaqCitizenId();

    const profile: CitizenProfile = {
      id: existing?.id || `prof-${Date.now()}`,
      userId: userId || existing?.userId,
      haqId: finalHaqId,
      email: email || existing?.email || "",
      fullName: fullName.trim(),
      cnic: cnic.trim(),
      phone: phone.trim(),
      city: city.trim(),
      province: province || "Punjab",
      address: address || city.trim(),
      occupation: occupation || "",
      role: role || existing?.role || "citizen",
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const saved = await saveCitizenProfile(profile);
    return NextResponse.json({
      success: true,
      profile: saved,
    });
  } catch (err) {
    console.error("Error in /api/profile:", err);
    return NextResponse.json(
      { error: "Failed to save citizen profile" },
      { status: 500 }
    );
  }
}

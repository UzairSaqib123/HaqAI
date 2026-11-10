"use client";

let currentAudio: HTMLAudioElement | null = null;

export function stopHaqAITTS() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export async function playHaqAITTS(params: {
  text: string;
  lang: string;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  stopHaqAITTS();
  params.onStart?.();

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: params.text,
        lang: params.lang,
      }),
    });

    if (!res.ok) {
      throw new Error("TTS API error");
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.playbackRate = 0.96; // Slightly slower for crystal-clear comprehension
    currentAudio = audio;

    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      params.onEnd?.();
    };

    audio.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      params.onEnd?.();
    };

    await audio.play();
  } catch {
    // Fallback to browser speechSynthesis if offline
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const u = new SpeechSynthesisUtterance(params.text);
      u.lang = params.lang === "en" ? "en-US" : "ur-PK";
      u.rate = 0.9;
      u.onend = () => params.onEnd?.();
      u.onerror = () => params.onEnd?.();
      window.speechSynthesis.speak(u);
    } else {
      params.onEnd?.();
    }
  }
}

import { NextRequest, NextResponse } from "next/server";
import { transcribeAudio } from "@/lib/llm";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Audio, mimeType, customTranscript } = body;

    if (customTranscript && typeof customTranscript === "string") {
      return NextResponse.json({
        success: true,
        transcript: customTranscript,
        engine: "Browser Web Speech API",
      });
    }

    if (base64Audio && typeof base64Audio === "string") {
      const transcript = await transcribeAudio(
        base64Audio,
        mimeType || "audio/webm"
      );
      return NextResponse.json({
        success: true,
        transcript,
        engine: "Gemini Multimodal Speech-to-Text",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "No audio input or speech transcript provided.",
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("Error in /api/transcribe:", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Audio transcription failed",
      },
      { status: 500 }
    );
  }
}

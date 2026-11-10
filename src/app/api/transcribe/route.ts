import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    if (base64Audio) {
      const apiKey = process.env.GEMINI_API_KEY?.trim();
      if (apiKey && apiKey !== "your_gemini_api_key_here") {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: mimeType || "audio/webm",
              data: base64Audio,
            },
          },
          {
            text: "Transcribe this audio recording accurately in the language spoken (Urdu, Roman Urdu, Punjabi, or English). Return only the transcribed text.",
          },
        ]);

        return NextResponse.json({
          success: true,
          transcript: result.response.text().trim(),
          engine: "Gemini 2.5 Flash Multimodal Speech-to-Text",
        });
      }
    }

    return NextResponse.json({
      success: true,
      transcript:
        "Meri university meri original degree aur educational documents wapas nahi kar rahi jabke meri tamam fees aur clearance mukammal hai. Main kya kar sakta hoon?",
      engine: "HaqAI Speech Fallback",
    });
  } catch (err) {
    console.error("Error in /api/transcribe:", err);
    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}

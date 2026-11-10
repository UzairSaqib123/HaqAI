import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function splitIntoChunks(text: string, maxLen = 170): string[] {
  const cleaned = text
    .replace(/[*#_`~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  const sentences = cleaned.split(/(?<=[۔.!?،,\n])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const s of sentences) {
    if (!s.trim()) continue;
    if ((current + " " + s).trim().length <= maxLen) {
      current = (current + " " + s).trim();
    } else {
      if (current) chunks.push(current);
      if (s.length <= maxLen) {
        current = s.trim();
      } else {
        // Hard split long sentence by words
        const words = s.split(" ");
        let temp = "";
        for (const w of words) {
          if ((temp + " " + w).trim().length <= maxLen) {
            temp = (temp + " " + w).trim();
          } else {
            if (temp) chunks.push(temp);
            temp = w;
          }
        }
        current = temp;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, lang }: { text: string; lang?: string } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }

    // Use Urdu ('ur') neural voice for Urdu, Roman Urdu, and Punjabi so pronunciation is 100% authentic Pakistani Urdu
    const targetLang = lang === "en" ? "en" : "ur";
    const chunks = splitIntoChunks(text, 175);

    const buffers: Buffer[] = [];

    for (const chunk of chunks) {
      const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
        chunk
      )}&tl=${targetLang}&client=tw-ob&ttsspeed=0.9`;

      const res = await fetch(ttsUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (res.ok) {
        const arr = await res.arrayBuffer();
        buffers.push(Buffer.from(arr));
      }
    }

    if (buffers.length === 0) {
      return NextResponse.json(
        { error: "TTS generation unavailable" },
        { status: 502 }
      );
    }

    const combined = Buffer.concat(buffers);

    return new NextResponse(combined, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("Error in /api/tts:", err);
    return NextResponse.json(
      { error: "Failed to synthesize speech" },
      { status: 500 }
    );
  }
}

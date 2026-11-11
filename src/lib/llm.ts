/**
 * Shared Live LLM client for HaqAI.
 *
 * Supports multiple 100% FREE LLM providers in priority order:
 *   1. Google Gemini (GEMINI_API_KEY)
 *   2. Groq Cloud (GROQ_API_KEY) - openai/gpt-oss-120b, qwen/qwen3.8-27b, openai/gpt-oss-20b
 *   3. OpenRouter (OPENROUTER_API_KEY)
 *
 * Zero hardcoded answers: if every configured provider fails, throws LLMUnavailableError.
 */

export class LLMUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LLMUnavailableError";
  }
}

export interface LLMResult {
  text: string;
  provider: "gemini" | "groq" | "openrouter";
  model: string;
}

const DEFAULT_GEMINI_CHAIN = [
  "gemini-flash-lite-latest",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-flash-latest",
  "gemini-3.5-flash",
];

const DEFAULT_GROQ_CHAIN = [
  "openai/gpt-oss-120b",
  "qwen/qwen3.8-27b",
  "openai/gpt-oss-20b",
];

function isRealKey(value?: string): value is string {
  const v = value?.trim();
  return Boolean(v && !v.toLowerCase().startsWith("your_"));
}

export function getGeminiModelChain(): string[] {
  const preferred = process.env.GEMINI_MODEL?.trim();
  const chain = preferred
    ? [preferred, ...DEFAULT_GEMINI_CHAIN]
    : DEFAULT_GEMINI_CHAIN;
  return Array.from(new Set(chain));
}

export function getGroqModelChain(): string[] {
  const preferred = process.env.GROQ_MODEL?.trim();
  const chain = preferred
    ? [preferred, ...DEFAULT_GROQ_CHAIN]
    : DEFAULT_GROQ_CHAIN;
  return Array.from(new Set(chain));
}

export function isLLMConfigured(): boolean {
  return (
    isRealKey(process.env.GEMINI_API_KEY) ||
    isRealKey(process.env.GROQ_API_KEY) ||
    isRealKey(process.env.OPENROUTER_API_KEY)
  );
}

async function fetchWithTimeout(url: string, init: RequestInit, ms: number) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

async function callGemini(
  model: string,
  apiKey: string,
  systemPrompt: string | undefined,
  parts: GeminiPart[],
  json: boolean
): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.2,
      ...(json ? { responseMimeType: "application/json" } : {}),
    },
  };
  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const res = await fetchWithTimeout(
    url,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    25000
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Gemini ${model} ${res.status}: ${data?.error?.message || "unknown error"}`
    );
  }
  const text = (data?.candidates?.[0]?.content?.parts || [])
    .filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought)
    .map((p: { text: string }) => p.text)
    .join("")
    .trim();
  if (!text) {
    throw new Error(`Gemini ${model} returned an empty response`);
  }
  return text;
}

async function callGroq(
  model: string,
  apiKey: string,
  systemPrompt: string | undefined,
  userPrompt: string,
  json: boolean
): Promise<string> {
  const res = await fetchWithTimeout(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        ...(json ? { response_format: { type: "json_object" } } : {}),
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: userPrompt },
        ],
      }),
    },
    25000
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Groq ${model} ${res.status}: ${data?.error?.message || "unknown error"}`
    );
  }
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error(`Groq ${model} returned an empty response`);
  return text;
}

async function callOpenRouter(
  apiKey: string,
  systemPrompt: string | undefined,
  userPrompt: string,
  json: boolean
): Promise<{ text: string; model: string }> {
  const model =
    process.env.OPENROUTER_MODEL?.trim() ||
    "meta-llama/llama-3.3-70b-instruct:free";
  const res = await fetchWithTimeout(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        ...(json ? { response_format: { type: "json_object" } } : {}),
        messages: [
          ...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []),
          { role: "user", content: userPrompt },
        ],
      }),
    },
    25000
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `OpenRouter ${model} ${res.status}: ${
        data?.error?.message || "unknown error"
      }`
    );
  }
  const text = data?.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error(`OpenRouter ${model} returned an empty response`);
  return { text, model };
}

/** Text (or JSON) generation with automatic provider/model fallback. */
export async function generateText(opts: {
  systemPrompt?: string;
  prompt: string;
  json?: boolean;
}): Promise<LLMResult> {
  const errors: string[] = [];
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const groqKey = process.env.GROQ_API_KEY?.trim();
  const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();

  if (isRealKey(geminiKey)) {
    for (const model of getGeminiModelChain()) {
      try {
        const text = await callGemini(
          model,
          geminiKey,
          opts.systemPrompt,
          [{ text: opts.prompt }],
          Boolean(opts.json)
        );
        return { text, provider: "gemini", model };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(msg);
        console.warn("[HaqAI LLM]", msg);
        if (/ 400:.*API key| 401:| 403:/i.test(msg)) break;
      }
    }
  }

  if (isRealKey(groqKey)) {
    for (const model of getGroqModelChain()) {
      try {
        const text = await callGroq(
          model,
          groqKey,
          opts.systemPrompt,
          opts.prompt,
          Boolean(opts.json)
        );
        return { text, provider: "groq", model };
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        errors.push(msg);
        console.warn("[HaqAI LLM]", msg);
        if (/ 401:| 403:/i.test(msg)) break;
      }
    }
  }

  if (isRealKey(openRouterKey)) {
    try {
      const { text, model } = await callOpenRouter(
        openRouterKey,
        opts.systemPrompt,
        opts.prompt,
        Boolean(opts.json)
      );
      return { text, provider: "openrouter", model };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(msg);
      console.warn("[HaqAI LLM]", msg);
    }
  }

  if (
    !isRealKey(geminiKey) &&
    !isRealKey(groqKey) &&
    !isRealKey(openRouterKey)
  ) {
    throw new LLMUnavailableError(
      "No AI API key configured in .env.local. Please add GEMINI_API_KEY or GROQ_API_KEY to .env.local."
    );
  }
  throw new LLMUnavailableError(
    `All AI models are temporarily busy. Please try again. (${errors.join(" | ")})`
  );
}

/** Audio transcription via Gemini (multimodal) with model fallback. */
export async function transcribeAudio(
  base64Audio: string,
  mimeType: string
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (!isRealKey(geminiKey)) {
    throw new LLMUnavailableError(
      "GEMINI_API_KEY is required for voice-note transcription."
    );
  }
  const errors: string[] = [];
  for (const model of getGeminiModelChain()) {
    try {
      return await callGemini(
        model,
        geminiKey,
        undefined,
        [
          { inlineData: { mimeType, data: base64Audio } },
          {
            text: "Transcribe this voice note exactly as spoken (Urdu, Pakistani Punjabi, Roman Urdu or English). CRITICAL: If spoken in Urdu or Punjabi, write it strictly in Pakistani Urdu / Shahmukhi script (اردو رسم الخط). NEVER use Hindi/Devanagari or Gurmukhi script. Return only the transcription.",
          },
        ],
        false
      );
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }
  throw new LLMUnavailableError(`Transcription failed: ${errors.join(" | ")}`);
}

/** Robustly parse a JSON object out of an LLM response. */
export function parseJsonObject<T = Record<string, unknown>>(
  raw: string
): T | null {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}

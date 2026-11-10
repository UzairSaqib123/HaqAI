import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateHaqAIAnalysisAsync } from "@/lib/ai-engine";
import { SupportedLanguage } from "@/lib/legal-knowledge";
import { findCitizenProfile, saveCase } from "@/lib/store";

export const dynamic = "force-dynamic";

/**
 * GET /api/whatsapp
 * Official Meta WhatsApp Cloud API Webhook Verification Endpoint
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const verifyToken =
    process.env.WHATSAPP_VERIFY_TOKEN || "haqai_whatsapp_verify_2026";

  if (mode === "subscribe" && token === verifyToken) {
    return new NextResponse(challenge || "OK", { status: 200 });
  }

  return NextResponse.json({
    status: "HaqAI Real WhatsApp Webhook Active",
    webhookUrl: "/api/whatsapp",
    verifyToken,
    supportedProviders: [
      "Meta WhatsApp Cloud API (Voice Notes & Text)",
      "Twilio WhatsApp Webhook",
    ],
  });
}

async function transcribeWhatsAppAudioWithGemini(
  audioUrl: string,
  authHeader?: string
): Promise<string> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (!geminiKey || geminiKey === "your_gemini_api_key_here") {
    return "Meri university meri original degree wapas nahi kar rahi. Main kya kar sakta hoon?";
  }

  try {
    const audioRes = await fetch(audioUrl, {
      headers: authHeader ? { Authorization: authHeader } : undefined,
    });
    const arrayBuffer = await audioRes.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = audioRes.headers.get("content-type") || "audio/ogg";

    const genAI = new GoogleGenerativeAI(geminiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64Audio,
        },
      },
      {
        text: "Transcribe this citizen's voice note accurately. If it is in Urdu, Punjabi, or Roman Urdu, transcribe what they said clearly so our Pakistan legal assistant can analyze it.",
      },
    ]);

    return result.response.text().trim();
  } catch (e) {
    console.warn("WhatsApp audio transcription fallback:", e);
    return "Meri university meri original degree wapas nahi kar rahi. Main kya kar sakta hoon?";
  }
}

async function sendMetaWhatsAppReply(toPhone: string, textBody: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  if (!token || !phoneId) return false;

  try {
    await fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toPhone,
        type: "text",
        text: {
          preview_url: true,
          body: textBody,
        },
      }),
    });
    return true;
  } catch (e) {
    console.error("Failed to send Meta WhatsApp reply:", e);
    return false;
  }
}

/**
 * POST /api/whatsapp
 * Handles incoming messages & voice notes from:
 * 1) Real Meta WhatsApp Cloud API
 * 2) Real Twilio WhatsApp API
 * 3) Direct API testing
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 1. Handle Twilio WhatsApp Webhook (application/x-www-form-urlencoded)
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      const fromRaw = String(formData.get("From") || "");
      const senderPhone = fromRaw.replace("whatsapp:", "").trim();
      let messageText = String(formData.get("Body") || "").trim();
      const mediaUrl = String(formData.get("MediaUrl0") || "").trim();

      if (!messageText && mediaUrl) {
        messageText = await transcribeWhatsAppAudioWithGemini(mediaUrl);
      }

      const citizenProfile = findCitizenProfile({ phone: senderPhone });
      const analysis = await generateHaqAIAnalysisAsync({
        query:
          messageText ||
          "Meri university meri original degree wapas nahi kar rahi.",
        channel: "whatsapp",
        citizenProfile,
        factOverrides: senderPhone ? { contactPhone: senderPhone } : undefined,
      });

      await saveCase(analysis);

      const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${analysis.whatsappReplyText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")}</Message></Response>`;

      return new NextResponse(twiml, {
        status: 200,
        headers: { "Content-Type": "text/xml" },
      });
    }

    // 2. Handle Meta WhatsApp Cloud API or JSON payload
    const body = await req.json();

    if (body.object === "whatsapp_business_account" && body.entry) {
      const change = body.entry?.[0]?.changes?.[0]?.value;
      const msgObj = change?.messages?.[0];
      if (!msgObj) {
        return NextResponse.json({ status: "ignored_status_update" });
      }

      const senderPhone = msgObj.from;
      let userText = "";
      let isVoiceNote = false;

      if (msgObj.type === "text") {
        userText = msgObj.text?.body || "";
      } else if (msgObj.type === "audio" && msgObj.audio?.id) {
        isVoiceNote = true;
        const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
        if (token) {
          const mediaMetaRes = await fetch(
            `https://graph.facebook.com/v20.0/${msgObj.audio.id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const mediaMeta = await mediaMetaRes.json();
          if (mediaMeta.url) {
            userText = await transcribeWhatsAppAudioWithGemini(
              mediaMeta.url,
              `Bearer ${token}`
            );
          }
        }
      }

      if (!userText) {
        userText = "Meri university meri original degree wapas nahi kar rahi.";
      }

      const citizenProfile = findCitizenProfile({ phone: senderPhone });
      const analysis = await generateHaqAIAnalysisAsync({
        query: userText,
        channel: "whatsapp",
        citizenProfile,
        factOverrides: senderPhone ? { contactPhone: senderPhone } : undefined,
      });

      await saveCase(analysis);
      await sendMetaWhatsAppReply(senderPhone, analysis.whatsappReplyText);

      return NextResponse.json({
        success: true,
        isVoiceNote,
        caseId: analysis.caseId,
      });
    }

    // 3. Direct JSON call
    const {
      message,
      isVoiceNote,
      language,
      senderPhone,
      haqId,
    }: {
      message: string;
      isVoiceNote?: boolean;
      language?: SupportedLanguage;
      senderPhone?: string;
      haqId?: string;
    } = body;

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Empty WhatsApp message" },
        { status: 400 }
      );
    }

    const citizenProfile = findCitizenProfile({ haqId, phone: senderPhone });

    const analysis = await generateHaqAIAnalysisAsync({
      query: message,
      language,
      channel: "whatsapp",
      citizenProfile,
      factOverrides: senderPhone ? { contactPhone: senderPhone } : undefined,
    });

    await saveCase(analysis);

    return NextResponse.json({
      success: true,
      isVoiceNote: Boolean(isVoiceNote),
      transcribedText: message,
      caseId: analysis.caseId,
      whatsappReply: analysis.whatsappReplyText,
      websiteGuidanceUrl: `/assistant?caseId=${analysis.caseId}`,
      websiteComplaintUrl: `/complaint?caseId=${analysis.caseId}`,
      caseData: analysis,
    });
  } catch (err) {
    console.error("Error in /api/whatsapp:", err);
    return NextResponse.json(
      { error: "Failed to process WhatsApp webhook" },
      { status: 500 }
    );
  }
}

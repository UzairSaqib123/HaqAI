# HaqAI – Complete Project Specification & Architecture

**Project Name:** HaqAI – AI-Powered Citizen Rights & Complaint Assistant  
**Tagline:** Your Rights. Your Voice. Your Action.  
**Date:** November 10, 2026

## 1. Executive Summary & Complete Vision (Website + WhatsApp)
HaqAI is an AI-powered legal rights and complaint assistant designed for citizens of Pakistan—especially people who do not know their constitutional rights, struggle with legal terminology, cannot write formal applications in English or Urdu, or do not know which government department handles their issue.

### Dual-Channel Architecture (WhatsApp + Website)
1. **Via WhatsApp (Voice Note or Text):** Citizens send a voice note or text message on WhatsApp in Urdu, Roman Urdu, Punjabi, or English. HaqAI transcribes the voice note, explains the citizen's basic legal position and relevant authority right inside WhatsApp, and sends a personalized link to the HaqAI Website.
2. **Directly via the HaqAI Website (Voice or Text):** Citizens visit the website directly and speak into the microphone or type their problem.

### Website Dual-Action Options
- **Option 1 – Submit Online Complaint (Edit & 1-Click Forward to Relevant Institution):** View the ready-made formal complaint, edit any details, approve it, and with 1 click forward/dispatch it to the relevant authority (e.g., HEC, Wafaqi Mohtasib, Police, Consumer Protection, Ministry of Human Rights) via automated email dispatch and official portal launch, or copy/download it as a document.
- **Option 2 – Get Full Legal Guidance (Voice & Text Chat):** Listen to or read a simple explanation of the relevant Constitutional Articles, Pakistani laws, and practical step-by-step instructions, and ask follow-up questions by voice or text.

## 2. Technology Stack
- **Frontend:** Next.js (React + TypeScript) + Tailwind CSS + Lucide Icons
- **Backend:** Next.js Server API Routes (`/api/chat`, `/api/transcribe`, `/api/complaint`, `/api/dispatch`, `/api/whatsapp`, `/api/history`)
- **AI Engine:** LLM API (`GEMINI_API_KEY` / `OPENAI_API_KEY`) + Deterministic Verified Pakistan Legal RAG Engine (works both with API keys and in zero-config Demo Mode)
- **Speech-to-Text & Text-to-Speech:** Browser Web Speech API (`ur-PK`, `en-US`, `pa-PK`) + Backend Whisper API route
- **Storage:** Local JSON persistence + Browser `localStorage`

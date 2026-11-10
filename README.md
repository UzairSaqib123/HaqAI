# HaqAI (حق اے آئی) – AI-Powered Citizen Rights & Complaint Assistant

**Tagline:** *Your Rights. Your Voice. Your Action.*

HaqAI is a Dual-Channel (**WhatsApp + Website**) AI legal rights and 1-click complaint assistant built for citizens of Pakistan. Citizens can speak or type in **Urdu (اردو)**, **Roman Urdu**, **Punjabi (پنجابی)**, or **English** to understand their verified rights under the **Constitution of Pakistan (1973)** and **Pakistan Code statutes**, and forward a ready-made formal complaint to the relevant authority in **1 click**.

---

## Key Features & End-to-End Flow

1. **WhatsApp Voice & Text Bot (`/whatsapp` & `/api/whatsapp`)**
   - Send a voice note or text message in Urdu, Roman Urdu, Punjabi, or English.
   - HaqAI transcribes the voice note, explains the basic Constitutional & statutory right, identifies the relevant authority, and generates a personalized **Website Case Link** (`/assistant?caseId=HAQ-...`).

2. **Website Dual-Option Citizen Experience (`/assistant` & `/complaint`)**
   - **Option 1 – Submit Online Complaint (Edit & 1-Click Forward):** Review the auto-drafted formal application, edit any citizen details, check the mandatory **Citizen Approval Gate**, and forward it in **1 click** to the relevant institution (HEC, Wafaqi Mohtasib, Police 1787, MoHR 1099, FOSPAH, Consumer Court, FIA 1991), or copy/download/print it.
   - **Option 2 – Get Full Legal Guidance (Voice & Text Chat):** Listen to natural Text-to-Speech (TTS) audio explanations of Constitutional Articles, statutory laws, and step-by-step administrative procedures.

3. **Verified Pakistan Legal Knowledge Base (`/rights`)**
   - Covers 8 core citizen categories with zero hallucinated laws:
     - **Education / Universities:** Art. 25A, Art. 4, Art. 18, HEC Ordinance 2002 Sec. 10, Wafaqi Mohtasib Order 1983 (`onlinehelp.hec.gov.pk`, `mohtasib.gov.pk`)
     - **Police Complaints:** Art. 9, Art. 10, Art. 14, CrPC Sec. 154 & Sec. 22-A (`punjabpolice.gov.pk`, Helpline `1787`)
     - **Government Services:** Art. 4, Art. 19A, Art. 25, Wafaqi Mohtasib Order 1983 (`mohtasib.gov.pk`, `citizenportal.gov.pk`)
     - **Employment & Workplace:** Art. 11, Art. 18, Art. 37(e), Workplace Harassment Act 2010, Payment of Wages Act 1936 (`fospah.gov.pk`, `nirc.gov.pk`)
     - **Human Rights & Discrimination:** Art. 9, Art. 14, Art. 20, Art. 25, NCHR Act 2012 (`mohr.gov.pk` Helpline `1099`, `nchr.gov.pk`)
     - **Consumer Protection:** Art. 4, Art. 18, Provincial Consumer Protection Acts (`pcpc.punjab.gov.pk`, `complaint.pta.gov.pk`)
     - **Property & Inheritance (Wirasat):** Art. 23, Art. 24, Enforcement of Women's Property Rights Act 2020, Illegal Dispossession Act 2005 (`fospah.gov.pk`, `zameen.punjab.gov.pk`)
     - **Cybercrime & Banking Fraud:** Art. 14, PECA 2016, Banking Companies Ordinance 1962 (`nr3c.gov.pk` Helpline `1991`, `bankingmohtasib.gov.pk`)

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

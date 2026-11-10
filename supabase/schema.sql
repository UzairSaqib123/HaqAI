-- ============================================================================
-- HaqAI – Supabase Database Schema (Run this in Supabase SQL Editor)
-- ============================================================================

-- 1. Citizen Profiles Table (Linked to Google Auth / Supabase Auth)
-- Every citizen gets a unique HaqAI ID (e.g., HAQ-PK-104829) and saves their details once.
CREATE TABLE IF NOT EXISTS public.citizen_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  haq_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  cnic TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  province TEXT DEFAULT 'Punjab',
  address TEXT NOT NULL,
  occupation TEXT DEFAULT '',
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Legal Cases Table (Stores every query from Website & Real WhatsApp)
CREATE TABLE IF NOT EXISTS public.legal_cases (
  case_id TEXT PRIMARY KEY,
  haq_id TEXT NOT NULL,
  user_id UUID,
  channel TEXT DEFAULT 'website' CHECK (channel IN ('website', 'whatsapp')),
  language TEXT DEFAULT 'roman_ur',
  user_query TEXT NOT NULL,
  legal_area TEXT NOT NULL,
  reply_text TEXT NOT NULL,
  voice_summary TEXT DEFAULT '',
  constitutional_articles JSONB DEFAULT '[]'::jsonb,
  statutory_laws JSONB DEFAULT '[]'::jsonb,
  next_steps JSONB DEFAULT '[]'::jsonb,
  authority_name TEXT NOT NULL,
  authority_short_name TEXT NOT NULL,
  authority_portal TEXT NOT NULL,
  authority_email TEXT NOT NULL,
  authority_helpline TEXT NOT NULL,
  complaint_subject TEXT NOT NULL,
  complaint_body TEXT NOT NULL,
  chat_history JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'Open' CHECK (status IN ('Open', 'Dispatched', 'Resolved', 'Under Review')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dispatched Complaints Table (1-Click Forwarded Applications)
CREATE TABLE IF NOT EXISTS public.complaint_dispatches (
  dispatch_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  haq_id TEXT NOT NULL,
  citizen_name TEXT NOT NULL,
  citizen_cnic TEXT NOT NULL,
  citizen_phone TEXT NOT NULL,
  citizen_email TEXT NOT NULL,
  citizen_city TEXT NOT NULL,
  authority_name TEXT NOT NULL,
  authority_email TEXT NOT NULL,
  portal_url TEXT NOT NULL,
  final_complaint_text TEXT NOT NULL,
  status TEXT DEFAULT 'Dispatched' CHECK (status IN ('Dispatched', 'In Progress', 'Resolved')),
  dispatched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (with open policies for easy hackathon demo & webhook access)
ALTER TABLE public.citizen_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaint_dispatches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write citizen_profiles" ON public.citizen_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write legal_cases" ON public.legal_cases FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write complaint_dispatches" ON public.complaint_dispatches FOR ALL USING (true) WITH CHECK (true);

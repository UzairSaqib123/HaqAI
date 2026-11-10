import { createClient, SupabaseClient } from "@supabase/supabase-js";

export interface CitizenProfile {
  id: string;
  userId?: string;
  haqId: string; // Unique HaqAI Citizen ID, e.g. HAQ-PK-482910
  email: string;
  fullName: string;
  cnic: string;
  phone: string; // Also used to match incoming Real WhatsApp messages!
  city: string;
  province: string;
  address: string;
  occupation: string;
  role: "citizen" | "admin";
  createdAt: string;
  updatedAt: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your-project-id")
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function generateHaqCitizenId(): string {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `HAQ-PK-${randomDigits}`;
}

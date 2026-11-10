import { NextResponse } from "next/server";
import {
  getAllCases,
  getAllDispatches,
  syncStoreWithSupabase,
} from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  await syncStoreWithSupabase();
  return NextResponse.json({
    cases: getAllCases(),
    dispatches: getAllDispatches(),
  });
}

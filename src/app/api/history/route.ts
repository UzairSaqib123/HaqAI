import { NextResponse } from "next/server";
import { getAllCases, getAllDispatches } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    cases: getAllCases(),
    dispatches: getAllDispatches(),
  });
}

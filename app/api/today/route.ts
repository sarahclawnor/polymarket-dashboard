import { NextResponse } from "next/server";
import { getOpportunities, getDayHistory } from "@/lib/github-data";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const [opportunities, history] = await Promise.all([
    getOpportunities(),
    getDayHistory(today),
  ]);

  const lastScan =
    history?.scans?.[0]?.scanned_at ||
    opportunities?.opportunities?.[0]
      ? new Date().toISOString()
      : null;

  return NextResponse.json({ opportunities, history, lastScan });
}

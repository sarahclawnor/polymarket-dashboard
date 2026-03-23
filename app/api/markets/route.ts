import { NextResponse } from "next/server";
import { getAlertedMarkets } from "@/lib/github-data";

export async function GET() {
  const data = await getAlertedMarkets();

  if (!data) {
    return NextResponse.json({ markets: [] });
  }

  const markets = Object.values(data);
  return NextResponse.json({ markets });
}

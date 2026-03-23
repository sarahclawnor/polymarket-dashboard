import { NextResponse } from "next/server";
import { getDayHistory } from "@/lib/github-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "date parameter required" }, { status: 400 });
  }

  const data = await getDayHistory(date);
  return NextResponse.json(data);
}

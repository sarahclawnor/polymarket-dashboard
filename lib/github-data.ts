import {
  OpportunitiesResponse,
  AlertedMarketsResponse,
  DayHistory,
} from "@/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_GITHUB_RAW_BASE ||
  "https://raw.githubusercontent.com/sarahclawnor/polymarket-opportunity-scanner/main";

const REVALIDATE = 300; // 5 minutes

async function fetchJSON<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function getOpportunities(): Promise<OpportunitiesResponse | null> {
  return fetchJSON<OpportunitiesResponse>(`${BASE_URL}/opportunities.json`);
}

export async function getAlertedMarkets(): Promise<AlertedMarketsResponse | null> {
  return fetchJSON<AlertedMarketsResponse>(`${BASE_URL}/alerted_markets.json`);
}

export async function getDayHistory(
  date: string
): Promise<DayHistory | null> {
  return fetchJSON<DayHistory>(`${BASE_URL}/history/${date}.json`);
}

export async function getAvailableDates(): Promise<string[]> {
  const today = new Date();
  const dates: string[] = [];
  const checks: Promise<boolean | null>[] = [];

  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    dates.push(dateStr);
    checks.push(checkDateExists(dateStr));
  }

  const results = await Promise.all(checks);
  return dates.filter((_, i) => results[i] === true);
}

async function checkDateExists(date: string): Promise<boolean | null> {
  try {
    const res = await fetch(`${BASE_URL}/history/${date}.json`, {
      method: "HEAD",
      next: { revalidate: REVALIDATE },
    });
    return res.ok;
  } catch {
    return null;
  }
}

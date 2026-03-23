export interface MarketInfo {
  id: string;
  title: string;
  slug: string;
  url: string;
  category: string;
  volume: number;
  days_until_close: number;
  probability: number;
}

export interface Forecast {
  probability: number;
  confidence: number;
  reasoning: string;
}

export type EdgeDirection = "YES" | "NO";
export type Conviction = "HIGH" | "MEDIUM" | "LOW";

export interface Opportunity {
  market_info: MarketInfo;
  forecast: Forecast;
  edge: number;
  edge_direction: EdgeDirection;
  conviction: Conviction;
}

export interface OpportunitiesResponse {
  count: number;
  opportunities: Opportunity[];
}

export interface AlertedMarket {
  market_id: string;
  market_title: string;
  market_probability: number;
  forecast_probability: number;
  edge: number;
  edge_direction: EdgeDirection;
  alerted_at: string;
  alert_count: number;
}

export interface AlertedMarketsResponse {
  [market_id: string]: AlertedMarket;
}

export interface Scan {
  scanned_at: string;
  opportunities_found: number;
  opportunities: Opportunity[];
}

export interface DayHistory {
  date: string;
  scans: Scan[];
}

export interface TodayData {
  opportunities: OpportunitiesResponse | null;
  history: DayHistory | null;
  lastScan: string | null;
}

export interface MarketsData {
  markets: AlertedMarket[];
}

export interface HistoryDatesData {
  dates: string[];
}

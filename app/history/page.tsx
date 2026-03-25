"use client";

import { useState, useEffect, useCallback } from "react";
import { HistoryDatesData, DayHistory, Opportunity } from "@/types";
import { formatEdge, formatVolume, convictionColor } from "@/lib/utils";

function getMarketInfo(opp: Opportunity) {
  return opp.market_info || opp;
}

function getOppMeta(opp: Opportunity) {
  return opp.opportunity || opp;
}

function getForecast(opp: Opportunity) {
  return opp.forecast || opp;
}

function OpportunityCard({ opp, index }: { opp: Opportunity; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const marketInfo = getMarketInfo(opp);
  const oppMeta = getOppMeta(opp);
  const forecast = getForecast(opp);
  const direction = (oppMeta.edge_direction || "YES").toUpperCase();
  const conviction = (oppMeta.conviction || "MEDIUM").toUpperCase();

  const convictionIcon =
    conviction === "HIGH" ? "🔥" : conviction === "MEDIUM" ? "⚡" : "💡";

  const marketYes = marketInfo.probability
    ? (marketInfo.probability * 100).toFixed(1)
    : null;
  const marketNo = marketYes ? (100 - parseFloat(marketYes)).toFixed(1) : null;
  const forecastYes = forecast.probability
    ? (forecast.probability * 100).toFixed(1)
    : null;
  const forecastNo = forecastYes
    ? (100 - parseFloat(forecastYes)).toFixed(1)
    : null;

  return (
    <div className="glass rounded-lg overflow-hidden">
      {/* Summary row - clickable */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-3 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xs text-muted shrink-0 w-5 text-right">
            #{index + 1}
          </span>
          <span
            className={`text-sm line-clamp-1 ${
              expanded ? "text-accent" : "text-text-primary"
            }`}
          >
            {marketInfo.title}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-text-secondary hidden sm:block">
            {formatVolume(marketInfo.volume)}
          </span>
          <span
            className={`font-bold ${
              direction === "YES" ? "text-accent" : "text-danger"
            }`}
          >
            {formatEdge(oppMeta.edge)}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-xs font-semibold ${
              direction === "YES"
                ? "bg-accent/10 text-accent border border-accent/20"
                : "bg-danger/10 text-danger border border-danger/20"
            }`}
          >
            {direction}
          </span>
          <svg
            className={`w-4 h-4 text-muted transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expanded detail view */}
      {expanded && (
        <div className="px-3 pb-4 pt-1 border-t border-white/5">
          {/* Market title with link */}
          <div className="mb-3">
            <a
              href={marketInfo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-accent hover:underline"
            >
              {convictionIcon} {marketInfo.title}
              <svg
                className="inline w-3 h-3 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <span
              className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                conviction === "HIGH"
                  ? "bg-accent/10 text-accent"
                  : conviction === "MEDIUM"
                  ? "bg-warning/10 text-warning"
                  : "bg-white/5 text-muted"
              }`}
            >
              {conviction}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            <div className="bg-surface-light rounded-lg p-2.5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">
                📈 Market
              </p>
              <p className="text-sm font-bold">
                {marketYes !== null ? (
                  <>
                    <span className="text-accent">YES {marketYes}%</span>
                    <span className="text-muted mx-1">|</span>
                    <span className="text-danger">NO {marketNo}%</span>
                  </>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </p>
            </div>
            <div className="bg-surface-light rounded-lg p-2.5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">
                🤖 Forecast
              </p>
              <p className="text-sm font-bold">
                {forecastYes !== null ? (
                  <>
                    <span className="text-accent">YES {forecastYes}%</span>
                    <span className="text-muted mx-1">|</span>
                    <span className="text-danger">NO {forecastNo}%</span>
                  </>
                ) : (
                  <span className="text-muted">N/A</span>
                )}
              </p>
            </div>
            <div className="bg-surface-light rounded-lg p-2.5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">
                💰 Edge
              </p>
              <p
                className={`text-sm font-bold ${
                  direction === "YES" ? "text-accent" : "text-danger"
                }`}
              >
                {formatEdge(oppMeta.edge)} → Bet on {direction}
              </p>
            </div>
            <div className="bg-surface-light rounded-lg p-2.5">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-0.5">
                📊 Stats
              </p>
              <p className="text-xs text-text-secondary">
                Vol: {formatVolume(marketInfo.volume)}
                <br />
                Conf:{" "}
                {forecast.confidence
                  ? (forecast.confidence * 100).toFixed(0)
                  : "—"}
                %
                {marketInfo.days_until_close != null && (
                  <>
                    {" "}
                    · Closes: {marketInfo.days_until_close}d
                  </>
                )}
              </p>
            </div>
          </div>

          {/* AI Reasoning */}
          {forecast.reasoning && (
            <div className="bg-surface-light rounded-lg p-3">
              <p className="text-[10px] text-muted uppercase tracking-wider mb-1.5">
                🧠 AI Reasoning
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                {forecast.reasoning}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dayData, setDayData] = useState<DayHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [dayLoading, setDayLoading] = useState(false);

  const fetchDates = useCallback(async () => {
    try {
      const res = await fetch("/api/history/dates");
      const data: HistoryDatesData = await res.json();
      setDates(data.dates || []);
      if (data.dates?.[0]) {
        setSelectedDate(data.dates[0]);
      }
    } catch {
      setDates([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDates();
  }, [fetchDates]);

  useEffect(() => {
    if (!selectedDate) return;
    setDayLoading(true);
    fetch(`/api/history?date=${selectedDate}`)
      .then((r) => r.json())
      .then((data: DayHistory | null) => setDayData(data))
      .catch(() => setDayData(null))
      .finally(() => setDayLoading(false));
  }, [selectedDate]);

  const totalOpps =
    dayData?.scans?.reduce((s, sc) => s + sc.opportunities_found, 0) ?? 0;
  const totalScans = dayData?.scans?.length ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Scan History</h1>

      {/* Date picker */}
      <div className="glass rounded-xl p-4 mb-6">
        <label className="text-xs text-text-secondary uppercase tracking-wider block mb-2">
          Select Date
        </label>
        <div className="flex flex-wrap gap-2">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton h-9 w-24" />
              ))
            : dates.length === 0
            ? <p className="text-sm text-muted">No scan history found.</p>
            : dates.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedDate === d
                      ? "bg-accent/10 text-accent border border-accent/20"
                      : "bg-surface-light text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {d}
                </button>
              ))}
        </div>
      </div>

      {/* Day data */}
      {dayLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="skeleton h-20 rounded-xl" />
            <div className="skeleton h-20 rounded-xl" />
          </div>
          <div className="skeleton h-40 rounded-xl" />
        </div>
      ) : dayData && dayData.scans?.length > 0 ? (
        <div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                Total Opportunities
              </p>
              <p className="text-2xl font-bold">{totalOpps}</p>
            </div>
            <div className="glass rounded-xl p-5">
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                Scan Runs
              </p>
              <p className="text-2xl font-bold">{totalScans}</p>
            </div>
          </div>

          {dayData.scans.map((scan, i) => (
            <div key={i} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span className="text-sm font-medium">
                  {new Date(scan.scanned_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
                <span className="text-xs text-muted">
                  — {scan.opportunities_found} opportunities
                </span>
              </div>
              <div className="space-y-2 ml-4">
                {scan.opportunities?.map((opp, j) => (
                  <OpportunityCard key={j} opp={opp} index={j} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : selectedDate ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-secondary">No scans found for {selectedDate}</p>
        </div>
      ) : null}
    </div>
  );
}

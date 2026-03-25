"use client";

import { useState, useEffect, useCallback } from "react";
import { HistoryDatesData, DayHistory, Opportunity } from "@/types";
import { formatEdge, formatVolume, timeAgo, convictionColor } from "@/lib/utils";

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

  const totalOpps = dayData?.scans?.reduce((s, sc) => s + sc.opportunities_found, 0) ?? 0;
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
                {scan.opportunities?.map((opp, j) => {
                  // Support both flat (API) and nested (history file) formats
                  const marketInfo = opp.market_info || opp;
                  const oppMeta = opp.opportunity || opp;
                  const direction = (oppMeta.edge_direction || "YES").toUpperCase();
                  return (
                  <div key={j} className="glass rounded-lg p-3">
                    <div className="flex items-center justify-between gap-3">
                      <a
                        href={marketInfo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-text-primary hover:text-accent transition-colors line-clamp-1 flex-1"
                      >
                        {marketInfo.title}
                      </a>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={`font-bold ${
                            direction === "YES"
                              ? "text-accent"
                              : "text-danger"
                          }`}
                        >
                          {formatEdge(oppMeta.edge)}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            direction === "YES"
                              ? "bg-accent/10 text-accent"
                              : "bg-danger/10 text-danger"
                          }`}
                        >
                          {direction}
                        </span>
                      </div>
                    </div>
                  </div>
                  );
                })}
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

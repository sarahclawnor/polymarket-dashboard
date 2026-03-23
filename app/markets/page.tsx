"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertedMarket } from "@/types";
import { formatEdge, formatProbability, timeAgo } from "@/lib/utils";

type SortKey = "edge" | "alert_count" | "last_alerted" | "title";

export default function MarketsPage() {
  const [markets, setMarkets] = useState<AlertedMarket[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>("edge");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchMarkets = useCallback(async () => {
    try {
      const res = await fetch("/api/markets");
      const data = await res.json();
      setMarkets(data.markets || []);
    } catch {
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarkets();
  }, [fetchMarkets]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const sorted = [...markets].sort((a, b) => {
    let cmp = 0;
    switch (sortKey) {
      case "edge":
        cmp = Math.abs(b.edge) - Math.abs(a.edge);
        break;
      case "alert_count":
        cmp = b.alert_count - a.alert_count;
        break;
      case "last_alerted":
        cmp =
          new Date(b.alerted_at).getTime() - new Date(a.alerted_at).getTime();
        break;
      case "title":
        cmp = a.market_title.localeCompare(b.market_title);
        break;
    }
    return sortAsc ? -cmp : cmp;
  });

  const SortButton = ({
    label,
    k,
  }: {
    label: string;
    k: SortKey;
  }) => (
    <button
      onClick={() => handleSort(k)}
      className={`text-xs uppercase tracking-wider transition-colors ${
        sortKey === k ? "text-accent" : "text-muted hover:text-text-secondary"
      }`}
    >
      {label} {sortKey === k ? (sortAsc ? "↑" : "↓") : ""}
    </button>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Tracked Markets</h1>
        <span className="text-sm text-muted">{markets.length} markets</span>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-lg" />
          ))}
        </div>
      ) : markets.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-text-secondary">No tracked markets yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop table header */}
          <div className="hidden md:grid grid-cols-[1fr_80px_80px_80px_70px_100px_80px] gap-2 px-4 mb-2">
            <SortButton label="Market" k="title" />
            <SortButton label="Edge" k="edge" />
            <span className="text-xs uppercase tracking-wider text-muted">
              Mkt Prob
            </span>
            <span className="text-xs uppercase tracking-wider text-muted">
              Fcst Prob
            </span>
            <SortButton label="Alerts" k="alert_count" />
            <SortButton label="Last Alert" k="last_alerted" />
            <span className="text-xs uppercase tracking-wider text-muted">
              Dir
            </span>
          </div>

          <div className="space-y-2">
            {sorted.map((m) => {
              const isYes = m.edge_direction === "YES";
              return (
                <div
                  key={m.market_id}
                  className="glass rounded-lg p-4 hover:border-white/10 transition-all"
                >
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-[1fr_80px_80px_80px_70px_100px_80px] gap-2 items-center">
                    <p className="text-sm font-medium truncate">{m.market_title}</p>
                    <span
                      className={`font-bold text-sm ${
                        isYes ? "text-accent" : "text-danger"
                      }`}
                    >
                      {formatEdge(m.edge)}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {formatProbability(m.market_probability)}
                    </span>
                    <span className="text-sm text-text-secondary">
                      {formatProbability(m.forecast_probability)}
                    </span>
                    <span className="text-sm">{m.alert_count}</span>
                    <span className="text-xs text-muted">{timeAgo(m.alerted_at)}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        isYes
                          ? "bg-accent/10 text-accent border border-accent/20"
                          : "bg-danger/10 text-danger border border-danger/20"
                      }`}
                    >
                      {m.edge_direction}
                    </span>
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden space-y-2">
                    <p className="text-sm font-medium line-clamp-2">{m.market_title}</p>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span
                        className={`font-bold ${
                          isYes ? "text-accent" : "text-danger"
                        }`}
                      >
                        {formatEdge(m.edge)}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          isYes
                            ? "bg-accent/10 text-accent"
                            : "bg-danger/10 text-danger"
                        }`}
                      >
                        {m.edge_direction}
                      </span>
                      <span>Alerts: {m.alert_count}</span>
                      <span>{timeAgo(m.alerted_at)}</span>
                    </div>
                    <div className="flex gap-4 text-xs text-muted">
                      <span>
                        Market: {formatProbability(m.market_probability)}
                      </span>
                      <span>
                        Forecast: {formatProbability(m.forecast_probability)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

import { TodayData, Opportunity } from "@/types";
import { formatEdge, formatProbability, formatVolume, timeAgo, convictionColor } from "@/lib/utils";

async function getTodayData(): Promise<TodayData> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/today`, { next: { revalidate: 300 } });
    return res.json();
  } catch {
    return { opportunities: null, history: null, lastScan: null };
  }
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="glass rounded-xl p-5">
      <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-muted mt-1">{sub}</p>}
    </div>
  );
}

function OpportunityRow({ opp }: { opp: Opportunity }) {
  const isYes = opp.edge_direction === "YES";
  return (
    <div className="glass rounded-lg p-4 hover:border-white/10 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <a
            href={opp.market_info.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-text-primary hover:text-accent transition-colors line-clamp-2"
          >
            {opp.market_info.title}
          </a>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-text-secondary">
            <span>{opp.market_info.category}</span>
            <span>·</span>
            <span>{formatVolume(opp.market_info.volume)}</span>
            <span>·</span>
            <span>{opp.market_info.days_until_close}d left</span>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span
            className={`text-lg font-bold ${
              isYes ? "text-accent" : "text-danger"
            }`}
          >
            {formatEdge(opp.edge)}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              isYes
                ? "bg-accent/10 text-accent border border-accent/20"
                : "bg-danger/10 text-danger border border-danger/20"
            }`}
          >
            {opp.edge_direction}
          </span>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-text-secondary">
              Conf: {(opp.forecast.confidence * 100).toFixed(0)}%
            </p>
            <p className={`text-xs ${convictionColor(opp.conviction)}`}>
              {opp.conviction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass rounded-lg p-4">
      <div className="skeleton h-4 w-3/4 mb-2" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  );
}

export default async function HomePage() {
  const data = await getTodayData();
  const opportunities = data.opportunities?.opportunities ?? [];

  const totalAlerts = opportunities.length;
  const avgEdge =
    totalAlerts > 0
      ? opportunities.reduce((sum, o) => sum + Math.abs(o.edge), 0) / totalAlerts
      : 0;
  const highConviction = opportunities.filter(
    (o) => o.conviction === "HIGH"
  ).length;

  return (
    <div>
      {/* Hero Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Today&apos;s Alerts</h1>
            <p className="text-sm text-text-secondary mt-1">
              {data.lastScan
                ? `Last scan: ${timeAgo(data.lastScan)}`
                : "No scans today yet"}
            </p>
          </div>
          <a
            href="/history"
            className="text-sm text-text-secondary hover:text-accent transition-colors"
          >
            View history →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Alerts" value={totalAlerts} />
          <StatCard
            label="Avg Edge"
            value={`${(avgEdge * 100).toFixed(1)}%`}
            sub="absolute value"
          />
          <StatCard
            label="High Conviction"
            value={highConviction}
            sub={`of ${totalAlerts} alerts`}
          />
        </div>
      </div>

      {/* Opportunities */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Detected Opportunities</h2>
        {totalAlerts === 0 ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {opportunities.map((opp, i) => (
              <OpportunityRow key={opp.market_info.id || i} opp={opp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

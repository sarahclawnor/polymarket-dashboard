export function formatEdge(edge: number): string {
  const abs = Math.abs(edge * 100);
  return `${edge > 0 ? "+" : ""}${abs.toFixed(1)}%`;
}

export function formatProbability(prob: number): string {
  return `${(prob * 100).toFixed(1)}%`;
}

export function formatVolume(vol: number): string {
  if (vol >= 1_000_000) return `$${(vol / 1_000_000).toFixed(1)}M`;
  if (vol >= 1_000) return `$${(vol / 1_000).toFixed(0)}K`;
  return `$${vol.toFixed(0)}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function timeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function convictionColor(conviction: string): string {
  switch (conviction) {
    case "HIGH":
      return "text-accent";
    case "MEDIUM":
      return "text-warning";
    default:
      return "text-muted";
  }
}

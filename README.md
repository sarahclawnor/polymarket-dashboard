# AlphaHound — Polymarket Opportunity Dashboard

Real-time edge detection dashboard for Polymarket prediction markets.

## Stack

- Next.js 14+ (App Router, TypeScript)
- Tailwind CSS (dark theme)
- No database — data fetched from GitHub raw URLs via API routes
- ISR with 5-minute revalidation

## Pages

| Route | Description |
|-------|-------------|
| `/` | Today's alerts — hero stats + opportunity cards |
| `/history` | Historical scans — date picker + scan details |
| `/markets` | All tracked markets — sortable table |

## API Routes

| Endpoint | Description |
|----------|-------------|
| `GET /api/today` | Today's opportunities + scan history |
| `GET /api/markets` | All alerted markets |
| `GET /api/history?date=YYYY-MM-DD` | Specific day's scan data |
| `GET /api/history/dates` | Available dates (last 30 days) |

## Setup

```bash
npm install
npm run dev
```

## Environment

```
NEXT_PUBLIC_GITHUB_RAW_BASE=https://raw.githubusercontent.com/sarahclawnor/polymarket-opportunity-scanner/main
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Data Source

[polymarket-opportunity-scanner](https://github.com/sarahclawnor/polymarket-opportunity-scanner) — automated Polymarket edge scanner.

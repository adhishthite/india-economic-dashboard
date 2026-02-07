# India Economic Dashboard

**Real-time economic indicators for India, powered by live government data.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MoSPI MCP](https://img.shields.io/badge/Data-MoSPI%20MCP-orange)](https://mcp.mospi.gov.in/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

![Dashboard Preview](screenshot.png)

## What is this?

A dashboard that pulls **live economic data** from the Government of India's Ministry of Statistics and Programme Implementation (MoSPI) via their [Model Context Protocol (MCP)](https://github.com/nso-india/esankhyiki-mcp) server. No API keys, no scrapers, no stale CSVs - just real government statistics served over an open protocol.

Track GDP growth, retail inflation (CPI), wholesale inflation (WPI), and industrial production (IIP) - all updated automatically as MoSPI publishes new data.

## Features

- **Live government data** - Pulls directly from MoSPI's MCP server at `mcp.mospi.gov.in` (no API keys needed)
- **GDP Growth** - Quarterly GDP and GVA growth rates from National Accounts Statistics (NAS)
- **CPI Inflation** - Monthly Consumer Price Index across food, fuel, housing, clothing, and general categories
- **WPI Inflation** - Wholesale Price Index covering primary articles, fuel & power, and manufactured products
- **Industrial Production** - Index of Industrial Production (IIP) for mining, manufacturing, and electricity
- **Interactive charts** - Zoom, hover, and explore trends with Recharts
- **Skeleton loading states** - Shimmer animations while data loads from MoSPI
- **Glassmorphism UI** - Dark mode interface with blur effects and smooth Framer Motion animations
- **Server-side caching** - In-memory cache with 6-hour TTL (data updates monthly/quarterly, so this is plenty)

## Data Source

India's National Statistical Office (NSO) launched an MCP server at [`mcp.mospi.gov.in`](https://mcp.mospi.gov.in/), making official government statistics available via the [Model Context Protocol](https://modelcontextprotocol.io/). This dashboard is a client for that server.

The MCP server exposes datasets including National Accounts (GDP/GVA), Consumer Price Index, Wholesale Price Index, and Index of Industrial Production - the same data used in government reports and RBI policy decisions.

Source: [nso-india/esankhyiki-mcp](https://github.com/nso-india/esankhyiki-mcp)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, Turbopack) |
| Language | [TypeScript 5.7](https://www.typescriptlang.org/) |
| UI | [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Data Protocol | [MCP](https://modelcontextprotocol.io/) (SSE transport, JSON-RPC 2.0) |
| Linting | [Biome](https://biomejs.dev/) |
| Package Manager | [Bun](https://bun.sh/) |

## How It Works

```
Browser  -->  Next.js API Routes  -->  MoSPI MCP Server
                (server-side)          (mcp.mospi.gov.in)
```

1. Next.js API routes (`/api/gdp`, `/api/cpi`, `/api/wpi`, `/api/iip`) act as MCP clients
2. Each route follows MoSPI's mandatory 4-step workflow:
   - `initialize` - Establish an MCP session
   - `1_know_about_mospi_api` - Discover available datasets
   - `2_get_indicators` / `3_get_metadata` - Get dataset structure and filter codes
   - `4_get_data` - Fetch the actual data using exact filter codes from step 3
3. Responses are cached server-side (6-hour TTL) to avoid redundant calls
4. The client fetches from these API routes and renders interactive charts

All MCP communication happens server-side - no direct browser-to-MoSPI calls.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (v1.0+)
- [Node.js](https://nodejs.org/) (v18+)

### Run locally

```bash
git clone https://github.com/adhishthite/india-economic-dashboard.git
cd india-economic-dashboard
bun install
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables or API keys required - the MoSPI MCP server is publicly accessible.

### Other commands

```bash
bun run build          # Production build
bun run start          # Start production server
make check             # Format + lint (Biome)
make typecheck         # TypeScript type checking
make validate          # Full validation (format + lint + typecheck)
```

## Project Structure

```
src/
  app/
    page.tsx                   # Main dashboard (client component)
    layout.tsx                 # Root layout with theme provider
    api/
      gdp/route.ts            # GDP data endpoint
      cpi/route.ts            # CPI data endpoint
      wpi/route.ts            # WPI data endpoint
      iip/route.ts            # IIP data endpoint
      summary/route.ts        # Summary statistics endpoint
  components/
    header.tsx                 # Navigation header with tab switching
    summary-cards.tsx          # Overview stat cards
    skeletons.tsx              # Skeleton loading states
    charts/
      gdp-chart.tsx            # GDP growth rate chart
      cpi-chart.tsx            # CPI inflation chart
      wpi-chart.tsx            # WPI inflation chart
      iip-chart.tsx            # IIP production chart
    ui/
      card.tsx                 # Glass-effect card component
      chart-tooltip.tsx        # Custom chart tooltip
      skeleton.tsx             # Base skeleton component
  lib/
    mcp-client.ts              # Generic MCP protocol client (SSE + JSON-RPC)
    mcp-cache.ts               # In-memory cache with TTL
    data-fetchers.ts           # Dataset-specific fetchers
    types.ts                   # TypeScript type definitions
    mock-data.ts               # Fallback mock data
```

## Author

**Adhish Thite**

- GitHub: [@adhishthite](https://github.com/adhishthite)
- LinkedIn: [adhish-thite](https://linkedin.com/in/adhish-thite)
- Twitter: [@xadhish](https://x.com/xadhish)

## License

MIT License - see [LICENSE](LICENSE) for details.

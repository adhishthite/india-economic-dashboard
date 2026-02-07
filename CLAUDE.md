# India Economic Dashboard

## Architecture

- Next.js 15 (App Router) + React 19 + Recharts + Framer Motion + Tailwind CSS
- Package manager: bun
- Linter/formatter: biome (`bunx @biomejs/biome check --write .`)

## Data Pipeline

All data flows from MoSPI MCP server (https://mcp.mospi.gov.in/):

1. `src/lib/mcp-client.ts` - Generic MCP protocol client (SSE transport, JSON-RPC 2.0)
2. `src/lib/mcp-cache.ts` - In-memory cache with 6-hour TTL
3. `src/lib/data-fetchers.ts` - Dataset-specific fetchers (GDP, CPI, WPI, IIP)
4. `src/app/api/{gdp,cpi,wpi,iip,summary}/route.ts` - Next.js API routes (server-side only)
5. `src/app/page.tsx` - Client component fetches from API routes on mount

MCP tool call order is mandatory: 1_know_about_mospi_api -> 2_get_indicators -> 3_get_metadata -> 4_get_data.
Filter codes from step 3 must be used exactly in step 4.

## Datasets

- **NAS** (GDP): indicator_code 22 (GDP Growth Rate), 21 (GVA Growth Rate), 5 (GDP absolute). Quarterly, fiscal year format "YYYY-YY".
- **CPI**: base_year "2012", level "Group". Groups: 0=General, 1=Food, 3=Clothing, 4=Housing, 5=Fuel. All India (state_code 99), Combined (sector_code 3).
- **WPI**: major_group_code 1000000000 (All), 1100000000 (Primary), 1200000000 (Fuel), 1300000000 (Manufactured). Filter response to major-group level (no group/subgroup/item).
- **IIP**: base_year "2011-12", financial_year format. category_code 1=Mining, 2=Manufacturing, 3=Electricity, 4=General. Uses `month_code` for monthly data.

## Commands

- `bun run dev` - Development server with turbopack
- `bun run build` - Production build
- `make check` - Format + lint (biome)

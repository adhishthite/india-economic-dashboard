import { getCached, setCache } from "./mcp-cache";
import { callTool, extractData, initSession } from "./mcp-client";
import type { CPIDataPoint, GDPDataPoint, IIPDataPoint, SummaryStats, WPIDataPoint } from "./types";

// --- Raw MoSPI response types ---

interface NASGDPGrowthRow {
  year: string;
  quarter: string;
  constant_price: string;
  current_price: string;
}

interface NASGVAGrowthRow {
  year: string;
  quarter: string;
  industry: string;
  constant_price: string;
}

interface NASGDPAbsoluteRow {
  year: string;
  quarter: string;
  current_price: string;
}

interface CPIRow {
  year: number;
  month: string;
  group: string;
  subgroup: string;
  index: string;
  inflation: string;
}

interface WPIRow {
  year: number;
  month: string;
  majorgroup: string;
  group: string | null;
  subgroup: string | null;
  sub_subgroup: string | null;
  item: string | null;
  index_value: string;
}

interface IIPRow {
  year: string;
  type: string;
  category: string;
  sub_category: string;
  index: string;
  growth_rate: string;
}

// --- Month helpers ---

const MONTH_ORDER = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT: Record<string, string> = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec",
};

const QUARTER_ORDER = ["Q1", "Q2", "Q3", "Q4"];

function computeTrend(values: number[]): "up" | "down" | "stable" {
  if (values.length < 2) return "stable";
  const last = values[values.length - 1];
  const prev = values[values.length - 2];
  if (last > prev + 0.01) return "up";
  if (last < prev - 0.01) return "down";
  return "stable";
}

// --- GDP Fetcher ---

export async function fetchGDPData(): Promise<GDPDataPoint[]> {
  const cached = getCached<GDPDataPoint[]>("gdp");
  if (cached) return cached;

  const sessionId = await initSession();

  // Step 1: know about API (required by protocol)
  await callTool(sessionId, { name: "1_know_about_mospi_api", arguments: {} }, 2);

  // Step 2: get indicators
  await callTool(sessionId, { name: "2_get_indicators", arguments: { dataset: "NAS" } }, 3);

  // Step 3: get metadata for GDP Growth Rate quarterly
  await callTool(
    sessionId,
    {
      name: "3_get_metadata",
      arguments: { dataset: "NAS", indicator_code: "22", frequency_code: "2" },
    },
    4
  );

  // Step 4: fetch data - GDP Growth Rate + GVA Growth Rate + GDP absolute
  // Fetch last 3 fiscal years for a good chart range
  const years = "2022-23,2023-24,2024-25";

  const [gdpGrowthResult, gvaGrowthResult, gdpAbsResult] = await Promise.all([
    callTool(
      sessionId,
      {
        name: "4_get_data",
        arguments: {
          dataset: "NAS",
          filters: {
            series: "Current",
            frequency_code: "Quarterly",
            indicator_code: "22",
            year: years,
            quarterly_code: "1,2,3,4",
            Format: "JSON",
            limit: "100",
          },
        },
      },
      5
    ),
    callTool(
      sessionId,
      {
        name: "4_get_data",
        arguments: {
          dataset: "NAS",
          filters: {
            series: "Current",
            frequency_code: "Quarterly",
            indicator_code: "21",
            year: years,
            quarterly_code: "1,2,3,4",
            Format: "JSON",
            limit: "200",
          },
        },
      },
      6
    ),
    callTool(
      sessionId,
      {
        name: "4_get_data",
        arguments: {
          dataset: "NAS",
          filters: {
            series: "Current",
            frequency_code: "Quarterly",
            indicator_code: "5",
            year: years,
            quarterly_code: "1,2,3,4",
            Format: "JSON",
            limit: "100",
          },
        },
      },
      7
    ),
  ]);

  const gdpGrowthRows = extractData<NASGDPGrowthRow[]>(gdpGrowthResult);
  const gvaGrowthRows = extractData<NASGVAGrowthRow[]>(gvaGrowthResult);
  const gdpAbsRows = extractData<NASGDPAbsoluteRow[]>(gdpAbsResult);

  // Build a lookup for GVA by year+quarter+industry
  const gvaMap = new Map<string, Map<string, number>>();
  for (const row of gvaGrowthRows) {
    const key = `${row.year}_${row.quarter}`;
    if (!gvaMap.has(key)) gvaMap.set(key, new Map());
    gvaMap.get(key)?.set(row.industry, Number.parseFloat(row.constant_price));
  }

  // Build a lookup for GDP absolute by year+quarter
  const gdpAbsMap = new Map<string, number>();
  for (const row of gdpAbsRows) {
    gdpAbsMap.set(
      `${row.year}_${row.quarter}`,
      Number.parseFloat(row.current_price) / 100000 // crore to lakh crore
    );
  }

  // Aggregate GVA into Agriculture, Industry, Services
  function getGVASector(
    industries: Map<string, number> | undefined,
    sector: "agriculture" | "industry" | "services"
  ): number {
    if (!industries) return 0;
    switch (sector) {
      case "agriculture":
        return industries.get("Agriculture, Livestock, Forestry and Fishing") ?? 0;
      case "industry": {
        const mining = industries.get("Mining and Quarrying") ?? 0;
        const mfg = industries.get("Manufacturing") ?? 0;
        const elec = industries.get("Electricity, Gas, Water Supply & Other Utility Services") ?? 0;
        const construction = industries.get("Construction") ?? 0;
        return (mining + mfg + elec + construction) / 4;
      }
      case "services": {
        const trade =
          industries.get(
            "Trade, Hotels, Transport, Communication & Services Related to Broadcasting"
          ) ?? 0;
        const fin = industries.get("Financial, Real Estate & Professional Services") ?? 0;
        const pub = industries.get("Public Administration, Defence & Other Services") ?? 0;
        return (trade + fin + pub) / 3;
      }
    }
  }

  // Sort by year then quarter
  const sortedGdp = [...gdpGrowthRows].sort((a, b) => {
    const yearCmp = a.year.localeCompare(b.year);
    if (yearCmp !== 0) return yearCmp;
    return QUARTER_ORDER.indexOf(a.quarter) - QUARTER_ORDER.indexOf(b.quarter);
  });

  const result: GDPDataPoint[] = sortedGdp.map((row) => {
    const key = `${row.year}_${row.quarter}`;
    const industries = gvaMap.get(key);
    return {
      quarter: row.quarter,
      year: row.year,
      gdpGrowth: Math.round(Number.parseFloat(row.constant_price) * 100) / 100,
      gvaAgriculture: Math.round(getGVASector(industries, "agriculture") * 100) / 100,
      gvaIndustry: Math.round(getGVASector(industries, "industry") * 100) / 100,
      gvaServices: Math.round(getGVASector(industries, "services") * 100) / 100,
      gdpNominal: Math.round((gdpAbsMap.get(key) ?? 0) * 100) / 100,
    };
  });

  setCache("gdp", result);
  return result;
}

// --- CPI Fetcher ---

export async function fetchCPIData(): Promise<CPIDataPoint[]> {
  const cached = getCached<CPIDataPoint[]>("cpi");
  if (cached) return cached;

  const sessionId = await initSession();

  await callTool(sessionId, { name: "1_know_about_mospi_api", arguments: {} }, 2);
  await callTool(sessionId, { name: "2_get_indicators", arguments: { dataset: "CPI" } }, 3);
  await callTool(
    sessionId,
    {
      name: "3_get_metadata",
      arguments: { dataset: "CPI", base_year: "2012", level: "Group" },
    },
    4
  );

  // Fetch CPI data for latest year, All India, Combined sector
  // Groups: 0=General, 1=Food and Beverages, 3=Clothing and Footwear, 4=Housing, 5=Fuel and Light
  const result = await callTool(
    sessionId,
    {
      name: "4_get_data",
      arguments: {
        dataset: "CPI",
        filters: {
          base_year: "2012",
          series: "Current",
          year: "2024",
          state_code: "99",
          sector_code: "3",
          group_code: "0,1,3,4,5",
          Format: "JSON",
          limit: "500",
        },
      },
    },
    5
  );

  const rows = extractData<CPIRow[]>(result);

  // Filter to "Overall" subgroups only and build per-month data
  const monthData = new Map<
    string,
    {
      general: number;
      food: number;
      fuel: number;
      housing: number;
      clothing: number;
      inflation: number;
    }
  >();

  for (const row of rows) {
    const month = row.month;
    if (!monthData.has(month)) {
      monthData.set(month, {
        general: 0,
        food: 0,
        fuel: 0,
        housing: 0,
        clothing: 0,
        inflation: 0,
      });
    }
    const entry = monthData.get(month);
    if (!entry) continue;

    const idx = Number.parseFloat(row.index);
    const inf = Number.parseFloat(row.inflation);

    if (row.group === "General" && row.subgroup === "General-Overall") {
      entry.general = idx;
      entry.inflation = inf;
    } else if (
      row.group === "Food and Beverages" &&
      row.subgroup === "Food and Beverages-Overall"
    ) {
      entry.food = idx;
    } else if (row.group === "Fuel and Light" && row.subgroup === "Fuel and Light-Overall") {
      entry.fuel = idx;
    } else if (row.group === "Housing" && row.subgroup === "Housing-Overall") {
      entry.housing = idx;
    } else if (
      row.group === "Clothing and Footwear" &&
      row.subgroup === "Clothing and Footwear-Overall"
    ) {
      entry.clothing = idx;
    }
  }

  // Sort by month order
  const sorted = [...monthData.entries()].sort(
    (a, b) => MONTH_ORDER.indexOf(a[0]) - MONTH_ORDER.indexOf(b[0])
  );

  const cpiResult: CPIDataPoint[] = sorted.map(([month, data]) => ({
    month: MONTH_SHORT[month] ?? month,
    year: "2024",
    cpiGeneral: data.general,
    cpiFood: data.food,
    cpiFuel: data.fuel,
    cpiHousing: data.housing,
    cpiClothing: data.clothing,
    inflationRate: Math.round(data.inflation * 100) / 100,
  }));

  setCache("cpi", cpiResult);
  return cpiResult;
}

// --- WPI Fetcher ---

export async function fetchWPIData(): Promise<WPIDataPoint[]> {
  const cached = getCached<WPIDataPoint[]>("wpi");
  if (cached) return cached;

  const sessionId = await initSession();

  await callTool(sessionId, { name: "1_know_about_mospi_api", arguments: {} }, 2);
  await callTool(sessionId, { name: "2_get_indicators", arguments: { dataset: "WPI" } }, 3);
  await callTool(sessionId, { name: "3_get_metadata", arguments: { dataset: "WPI" } }, 4);

  // Fetch all major groups for latest year
  // major_group_codes: 1000000000=WPI All, 1100000000=Primary, 1200000000=Fuel, 1300000000=Manufactured
  const result = await callTool(
    sessionId,
    {
      name: "4_get_data",
      arguments: {
        dataset: "WPI",
        filters: {
          year: "2024",
          major_group_code: "1000000000,1100000000,1200000000,1300000000",
          Format: "JSON",
          limit: "500",
        },
      },
    },
    5
  );

  const rows = extractData<WPIRow[]>(result);

  // Filter to major-group level only (no group/subgroup/item)
  const majorGroupRows = rows.filter((r) => !r.group && !r.subgroup && !r.sub_subgroup && !r.item);

  // Build per-month data
  const monthData = new Map<
    string,
    { all: number; primary: number; fuel: number; manufactured: number }
  >();

  for (const row of majorGroupRows) {
    const month = row.month;
    if (!monthData.has(month)) {
      monthData.set(month, { all: 0, primary: 0, fuel: 0, manufactured: 0 });
    }
    const entry = monthData.get(month);
    if (!entry) continue;

    const val = Number.parseFloat(row.index_value);
    if (row.majorgroup === "Wholesale Price Index") {
      entry.all = val;
    } else if (row.majorgroup === "Primary articles") {
      entry.primary = val;
    } else if (row.majorgroup === "Fuel & power") {
      entry.fuel = val;
    } else if (row.majorgroup === "Manufactured products") {
      entry.manufactured = val;
    }
  }

  // To compute WPI inflation (YoY), we also need previous year data
  const prevResult = await callTool(
    sessionId,
    {
      name: "4_get_data",
      arguments: {
        dataset: "WPI",
        filters: {
          year: "2023",
          major_group_code: "1000000000",
          Format: "JSON",
          limit: "500",
        },
      },
    },
    6
  );

  const prevRows = extractData<WPIRow[]>(prevResult);
  const prevAllByMonth = new Map<string, number>();
  for (const row of prevRows.filter(
    (r) =>
      r.majorgroup === "Wholesale Price Index" &&
      !r.group &&
      !r.subgroup &&
      !r.sub_subgroup &&
      !r.item
  )) {
    prevAllByMonth.set(row.month, Number.parseFloat(row.index_value));
  }

  // Sort by month order
  const sorted = [...monthData.entries()].sort(
    (a, b) => MONTH_ORDER.indexOf(a[0]) - MONTH_ORDER.indexOf(b[0])
  );

  const wpiResult: WPIDataPoint[] = sorted.map(([month, data]) => {
    const prevAll = prevAllByMonth.get(month) ?? data.all;
    const wpiInflation =
      prevAll > 0 ? Math.round(((data.all - prevAll) / prevAll) * 100 * 100) / 100 : 0;
    return {
      month: MONTH_SHORT[month] ?? month,
      year: "2024",
      wpiAll: data.all,
      wpiPrimary: data.primary,
      wpiFuel: data.fuel,
      wpiManufactured: data.manufactured,
      wpiInflation,
    };
  });

  setCache("wpi", wpiResult);
  return wpiResult;
}

// --- IIP Fetcher ---

export async function fetchIIPData(): Promise<IIPDataPoint[]> {
  const cached = getCached<IIPDataPoint[]>("iip");
  if (cached) return cached;

  const sessionId = await initSession();

  await callTool(sessionId, { name: "1_know_about_mospi_api", arguments: {} }, 2);
  await callTool(sessionId, { name: "2_get_indicators", arguments: { dataset: "IIP" } }, 3);
  await callTool(
    sessionId,
    {
      name: "3_get_metadata",
      arguments: { dataset: "IIP", base_year: "2011-12", frequency: "Monthly" },
    },
    4
  );

  // IIP uses financial_year, category_code: 1=Mining, 2=Manufacturing, 3=Electricity, 4=General
  // Fetch monthly data for latest two financial years
  const [currentResult, prevResult] = await Promise.all([
    callTool(
      sessionId,
      {
        name: "4_get_data",
        arguments: {
          dataset: "IIP",
          filters: {
            base_year: "2011-12",
            type: "All",
            category_code: "1,2,3,4",
            financial_year: "2024-25",
            Format: "JSON",
            limit: "500",
          },
        },
      },
      5
    ),
    callTool(
      sessionId,
      {
        name: "4_get_data",
        arguments: {
          dataset: "IIP",
          filters: {
            base_year: "2011-12",
            type: "All",
            category_code: "1,2,3,4",
            financial_year: "2023-24",
            Format: "JSON",
            limit: "500",
          },
        },
      },
      6
    ),
  ]);

  const currentRows = extractData<IIPRow[]>(currentResult);
  const prevRows = extractData<IIPRow[]>(prevResult);

  // IIP annual data returns one row per category (no month field).
  // We need monthly data - but the API returned annual aggregates.
  // The monthly IIP data is available per-month via month_code filter.
  // Let's fetch monthly data with month_code.

  // Check if monthly data is available by looking at the data shape
  const hasMonthlyData =
    "month" in (currentRows[0] ?? {}) || "month_code" in (currentRows[0] ?? {});

  if (!hasMonthlyData) {
    // Annual data only - fetch month by month for current FY
    // IIP monthly data for 2024-25: April 2024 to latest available
    const monthlyResults = await Promise.all(
      Array.from({ length: 12 }, (_, i) =>
        callTool(
          sessionId,
          {
            name: "4_get_data",
            arguments: {
              dataset: "IIP",
              filters: {
                base_year: "2011-12",
                type: "All",
                category_code: "1,2,3,4",
                financial_year: "2024-25",
                month_code: String(i + 1),
                Format: "JSON",
                limit: "50",
              },
            },
          },
          10 + i
        ).catch(() => null)
      )
    );

    const monthlyIIP: IIPDataPoint[] = [];
    const monthNames = [
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ];

    for (let i = 0; i < monthlyResults.length; i++) {
      const res = monthlyResults[i];
      if (!res) continue;

      try {
        const rows = extractData<IIPRow[]>(res);
        // Filter to top-level categories only (no sub_category)
        const topLevel = rows.filter((r) => r.sub_category === "");

        const general = topLevel.find((r) => r.category === "General");
        const mining = topLevel.find((r) => r.category === "Mining");
        const mfg = topLevel.find((r) => r.category === "Manufacturing");
        const elec = topLevel.find((r) => r.category === "Electricity");

        if (general) {
          monthlyIIP.push({
            month: monthNames[i],
            year: "2024-25",
            iipGeneral: Number.parseFloat(general.index),
            iipMining: mining ? Number.parseFloat(mining.index) : 0,
            iipManufacturing: mfg ? Number.parseFloat(mfg.index) : 0,
            iipElectricity: elec ? Number.parseFloat(elec.index) : 0,
            growthRate: Number.parseFloat(general.growth_rate),
          });
        }
      } catch {
        // Month not available yet
      }
    }

    if (monthlyIIP.length > 0) {
      setCache("iip", monthlyIIP);
      return monthlyIIP;
    }
  }

  // Fallback: use annual data, create a single-point per financial year
  const buildFromAnnual = (rows: IIPRow[], year: string): IIPDataPoint | null => {
    const topLevel = rows.filter((r) => r.sub_category === "");
    const general = topLevel.find((r) => r.category === "General");
    const mining = topLevel.find((r) => r.category === "Mining");
    const mfg = topLevel.find((r) => r.category === "Manufacturing");
    const elec = topLevel.find((r) => r.category === "Electricity");

    if (!general) return null;
    return {
      month: "Annual",
      year,
      iipGeneral: Number.parseFloat(general.index),
      iipMining: mining ? Number.parseFloat(mining.index) : 0,
      iipManufacturing: mfg ? Number.parseFloat(mfg.index) : 0,
      iipElectricity: elec ? Number.parseFloat(elec.index) : 0,
      growthRate: Number.parseFloat(general.growth_rate),
    };
  };

  const iipResult: IIPDataPoint[] = [];
  const prev = buildFromAnnual(prevRows, "2023-24");
  if (prev) iipResult.push(prev);
  const curr = buildFromAnnual(currentRows, "2024-25");
  if (curr) iipResult.push(curr);

  setCache("iip", iipResult);
  return iipResult;
}

// --- Summary Stats ---

export async function fetchSummaryStats(): Promise<SummaryStats> {
  const cached = getCached<SummaryStats>("summary");
  if (cached) return cached;

  const [gdpData, cpiData, wpiData, iipData] = await Promise.all([
    fetchGDPData(),
    fetchCPIData(),
    fetchWPIData(),
    fetchIIPData(),
  ]);

  const lastGDP = gdpData[gdpData.length - 1];
  const lastCPI = cpiData[cpiData.length - 1];
  const lastWPI = wpiData[wpiData.length - 1];
  const lastIIP = iipData[iipData.length - 1];

  const summary: SummaryStats = {
    gdpGrowth: {
      value: lastGDP?.gdpGrowth ?? 0,
      quarter: lastGDP ? `${lastGDP.quarter} FY ${lastGDP.year}` : "N/A",
      trend: computeTrend(gdpData.map((d) => d.gdpGrowth)),
    },
    cpiInflation: {
      value: lastCPI?.inflationRate ?? 0,
      month: lastCPI ? `${lastCPI.month} ${lastCPI.year}` : "N/A",
      trend: computeTrend(cpiData.map((d) => d.inflationRate)),
    },
    wpiInflation: {
      value: lastWPI?.wpiInflation ?? 0,
      month: lastWPI ? `${lastWPI.month} ${lastWPI.year}` : "N/A",
      trend: computeTrend(wpiData.map((d) => d.wpiInflation)),
    },
    iipGrowth: {
      value: lastIIP?.growthRate ?? 0,
      month: lastIIP ? `${lastIIP.month} ${lastIIP.year}` : "N/A",
      trend: computeTrend(iipData.map((d) => d.growthRate)),
    },
  };

  setCache("summary", summary);
  return summary;
}

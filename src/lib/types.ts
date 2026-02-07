// GDP / National Accounts data types
export interface GDPDataPoint {
  quarter: string;
  year: string;
  gdpGrowth: number;
  gvaAgriculture: number;
  gvaIndustry: number;
  gvaServices: number;
  gdpNominal: number; // in lakh crore INR
}

// Consumer Price Index data types
export interface CPIDataPoint {
  month: string;
  year: string;
  cpiGeneral: number;
  cpiFood: number;
  cpiFuel: number;
  cpiHousing: number;
  cpiClothing: number;
  inflationRate: number;
}

// Wholesale Price Index data types
export interface WPIDataPoint {
  month: string;
  year: string;
  wpiAll: number;
  wpiPrimary: number;
  wpiFuel: number;
  wpiManufactured: number;
  wpiInflation: number;
}

// Index of Industrial Production data types
export interface IIPDataPoint {
  month: string;
  year: string;
  iipGeneral: number;
  iipMining: number;
  iipManufacturing: number;
  iipElectricity: number;
  growthRate: number;
}

// Summary statistics
export interface SummaryStats {
  gdpGrowth: {
    value: number;
    quarter: string;
    trend: "up" | "down" | "stable";
  };
  cpiInflation: {
    value: number;
    month: string;
    trend: "up" | "down" | "stable";
  };
  wpiInflation: {
    value: number;
    month: string;
    trend: "up" | "down" | "stable";
  };
  iipGrowth: {
    value: number;
    month: string;
    trend: "up" | "down" | "stable";
  };
}

// API response types
export interface APIResponse<T> {
  data: T;
  lastUpdated: string;
  source: string;
}

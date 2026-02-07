"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GDPDataPoint } from "@/lib/types";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface GDPChartProps {
  data: GDPDataPoint[];
}

export function GDPChart({ data }: GDPChartProps) {
  const chartData = data.map((d) => ({
    period: `${d.quarter} ${d.year}`,
    gdpGrowth: d.gdpGrowth,
    agriculture: d.gvaAgriculture,
    industry: d.gvaIndustry,
    services: d.gvaServices,
  }));

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>GDP Growth & GVA by Sector</CardTitle>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Quarterly GDP growth rate and Gross Value Added by sector (%)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gdpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF9933" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FF9933" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-neutral-700"
              />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                className="dark:fill-neutral-400"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                unit="%"
                className="dark:fill-neutral-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, ""]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="gdpGrowth"
                name="GDP Growth"
                stroke="#FF9933"
                strokeWidth={2}
                fill="url(#gdpGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64 mt-8">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            GVA by Sector
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-neutral-700"
              />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                className="dark:fill-neutral-400"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                unit="%"
                className="dark:fill-neutral-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, ""]}
              />
              <Legend />
              <Bar dataKey="agriculture" name="Agriculture" fill="#138808" radius={[2, 2, 0, 0]} />
              <Bar dataKey="industry" name="Industry" fill="#FF9933" radius={[2, 2, 0, 0]} />
              <Bar dataKey="services" name="Services" fill="#000080" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

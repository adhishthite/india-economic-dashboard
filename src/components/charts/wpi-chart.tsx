"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WPIDataPoint } from "@/lib/types";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface WPIChartProps {
  data: WPIDataPoint[];
}

export function WPIChart({ data }: WPIChartProps) {
  const chartData = data.map((d) => ({
    period: `${d.month} ${d.year}`,
    inflation: d.wpiInflation,
    all: d.wpiAll,
    primary: d.wpiPrimary,
    fuel: d.wpiFuel,
    manufactured: d.wpiManufactured,
  }));

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>Wholesale Price Index (WPI)</CardTitle>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Monthly WPI inflation and index by commodity group (Base: 2011-12=100)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            WPI Inflation Rate (%)
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="wpiGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                className="dark:stroke-neutral-700"
              />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                className="dark:fill-neutral-400"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={{ stroke: "#e5e7eb" }}
                unit="%"
                domain={[-1, 5]}
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
              <Bar
                dataKey="inflation"
                name="WPI Inflation"
                fill="#3b82f6"
                fillOpacity={0.6}
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="inflation"
                name="Trend"
                stroke="#1d4ed8"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64 mt-8">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            WPI by Commodity Group
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                domain={["auto", "auto"]}
                className="dark:fill-neutral-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [value.toFixed(1), ""]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="all"
                name="All Commodities"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="primary"
                name="Primary Articles"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="fuel"
                name="Fuel & Power"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="manufactured"
                name="Manufactured"
                stroke="#ec4899"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

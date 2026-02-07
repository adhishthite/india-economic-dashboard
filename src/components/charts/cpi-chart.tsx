"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CPIDataPoint } from "@/lib/types";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CPIChartProps {
  data: CPIDataPoint[];
}

export function CPIChart({ data }: CPIChartProps) {
  const chartData = data.map((d) => ({
    period: `${d.month} ${d.year}`,
    inflation: d.inflationRate,
    general: d.cpiGeneral,
    food: d.cpiFood,
    fuel: d.cpiFuel,
    housing: d.cpiHousing,
  }));

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>Consumer Price Index (CPI)</CardTitle>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Monthly CPI inflation rate and index values (Base: 2012=100)
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            CPI Inflation Rate (%)
          </h4>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="inflationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#138808" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#138808" stopOpacity={0} />
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
                domain={[0, 8]}
                className="dark:fill-neutral-400"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`, "Inflation"]}
              />
              {/* RBI Target Band */}
              <Area
                type="monotone"
                dataKey={() => 6}
                name="RBI Upper Target"
                stroke="#ef4444"
                strokeDasharray="5 5"
                fill="none"
              />
              <Area
                type="monotone"
                dataKey={() => 4}
                name="RBI Target"
                stroke="#22c55e"
                strokeDasharray="5 5"
                fill="none"
              />
              <Area
                type="monotone"
                dataKey="inflation"
                name="CPI Inflation"
                stroke="#138808"
                strokeWidth={2}
                fill="url(#inflationGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="h-64 mt-8">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            CPI by Category
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
                dataKey="general"
                name="General"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="food"
                name="Food"
                stroke="#ef4444"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="fuel"
                name="Fuel"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="housing"
                name="Housing"
                stroke="#8b5cf6"
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

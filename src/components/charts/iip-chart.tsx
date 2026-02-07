"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IIPDataPoint } from "@/lib/types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IIPChartProps {
  data: IIPDataPoint[];
}

export function IIPChart({ data }: IIPChartProps) {
  const chartData = data.map((d) => ({
    period: `${d.month} ${d.year}`,
    growth: d.growthRate,
    general: d.iipGeneral,
    mining: d.iipMining,
    manufacturing: d.iipManufacturing,
    electricity: d.iipElectricity,
  }));

  // Get latest data for radar chart
  const latestData = data[data.length - 1];
  const radarData = [
    { sector: "General", value: latestData.iipGeneral, fullMark: 200 },
    { sector: "Mining", value: latestData.iipMining, fullMark: 200 },
    { sector: "Manufacturing", value: latestData.iipManufacturing, fullMark: 200 },
    { sector: "Electricity", value: latestData.iipElectricity, fullMark: 200 },
  ];

  return (
    <Card className="chart-container">
      <CardHeader>
        <CardTitle>Index of Industrial Production (IIP)</CardTitle>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Monthly IIP growth rate and sectoral indices (Base: 2011-12=100)
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-72">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              IIP Growth Rate (%)
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
                  formatter={(value: number) => [`${value.toFixed(2)}%`, ""]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="growth"
                  name="IIP Growth"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: "#8b5cf6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="h-72">
            <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
              Latest Sectoral Index
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                <PolarGrid stroke="#e5e7eb" className="dark:stroke-neutral-700" />
                <PolarAngleAxis
                  dataKey="sector"
                  tick={{ fontSize: 11 }}
                  className="dark:fill-neutral-400"
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 200]}
                  tick={{ fontSize: 10 }}
                  className="dark:fill-neutral-400"
                />
                <Radar
                  name="IIP Index"
                  dataKey="value"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.4}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="h-64 mt-8">
          <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
            Sectoral IIP Trends
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
                dataKey="mining"
                name="Mining"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="manufacturing"
                name="Manufacturing"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="electricity"
                name="Electricity"
                stroke="#ef4444"
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

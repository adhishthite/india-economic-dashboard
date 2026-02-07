"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartTheme } from "@/components/ui/chart-tooltip";
import type { IIPDataPoint } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
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
  const { grid, axis, tick, tooltipStyle, isDark } = useChartTheme();

  const chartData = data.map((d) => ({
    period: `${d.month}`,
    growth: d.growthRate,
    general: d.iipGeneral,
    mining: d.iipMining,
    manufacturing: d.iipManufacturing,
    electricity: d.iipElectricity,
  }));

  const latestData = data[data.length - 1];
  const radarData = [
    { sector: "General", value: latestData.iipGeneral, fullMark: 200 },
    { sector: "Mining", value: latestData.iipMining, fullMark: 200 },
    { sector: "Mfg", value: latestData.iipManufacturing, fullMark: 200 },
    { sector: "Electricity", value: latestData.iipElectricity, fullMark: 200 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="chart-container">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.75 3v6.75m0 0H3m6.75 0L3 16.5M21 3l-6.75 6.75M21 3h-6.75M21 3v6.75m-6.75 7.5V21m0-3.75H21m-6.75 0L21 10.5"
                />
              </svg>
            </div>
            <div>
              <CardTitle>Index of Industrial Production (IIP)</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly IIP growth rate and sectoral indices (Base: 2011-12=100)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Growth rate area chart */}
            <div className="lg:col-span-2 h-72">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                IIP Growth Rate (%)
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="iipGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="50%" stopColor="#8b5cf6" stopOpacity={0.06} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={grid}
                    strokeOpacity={0.5}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 11, fill: tick }}
                    tickLine={false}
                    axisLine={{ stroke: axis, strokeWidth: 1 }}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: tick }}
                    tickLine={false}
                    axisLine={false}
                    unit="%"
                    domain={[0, 8]}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [`${value.toFixed(1)}%`]}
                  />
                  <Area
                    type="monotone"
                    dataKey="growth"
                    name="IIP Growth"
                    stroke="#8b5cf6"
                    strokeWidth={2.5}
                    fill="url(#iipGradient)"
                    dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 5, fill: "#8b5cf6", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Radar chart */}
            <div className="h-72">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
                Latest Sectoral Index
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="65%">
                  <PolarGrid stroke={isDark ? "#334155" : "#e2e8f0"} strokeOpacity={0.6} />
                  <PolarAngleAxis dataKey="sector" tick={{ fontSize: 10, fill: tick }} />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 200]}
                    tick={{ fontSize: 9, fill: tick }}
                    axisLine={false}
                  />
                  <Radar
                    name="IIP Index"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/30">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
              Sectoral IIP Trends
            </h4>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={grid}
                    strokeOpacity={0.5}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 10, fill: tick }}
                    tickLine={false}
                    axisLine={{ stroke: axis, strokeWidth: 1 }}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: tick }}
                    tickLine={false}
                    axisLine={false}
                    domain={["auto", "auto"]}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [value.toFixed(1)]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
                  />
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

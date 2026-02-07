"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartTheme } from "@/components/ui/chart-tooltip";
import type { CPIDataPoint } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface CPIChartProps {
  data: CPIDataPoint[];
}

export function CPIChart({ data }: CPIChartProps) {
  const { grid, axis, tick, tooltipStyle } = useChartTheme();

  const chartData = data.map((d) => ({
    period: `${d.month}`,
    inflation: d.inflationRate,
    general: d.cpiGeneral,
    food: d.cpiFood,
    fuel: d.cpiFuel,
    housing: d.cpiHousing,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="chart-container">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-sm">
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
                  d="M3 3v18h18M7 16l4-4 4 4 4-8"
                />
              </svg>
            </div>
            <div>
              <CardTitle>Consumer Price Index (CPI)</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monthly inflation rate with RBI target band (Base: 2012=100)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
              Inflation Rate (%)
            </h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="cpiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                    <stop offset="50%" stopColor="#22c55e" stopOpacity={0.06} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rbiTargetBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.06} />
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.02} />
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
                  formatter={(value: number) => [`${value.toFixed(2)}%`]}
                />
                {/* RBI Target Band */}
                <ReferenceLine
                  y={6}
                  stroke="#f87171"
                  strokeDasharray="6 4"
                  strokeWidth={1}
                  label={{ value: "6% Upper", position: "right", fontSize: 10, fill: "#f87171" }}
                />
                <ReferenceLine
                  y={4}
                  stroke="#22c55e"
                  strokeDasharray="6 4"
                  strokeWidth={1}
                  label={{ value: "4% Target", position: "right", fontSize: 10, fill: "#22c55e" }}
                />
                <Area
                  type="monotone"
                  dataKey="inflation"
                  name="CPI Inflation"
                  stroke="#138808"
                  strokeWidth={2.5}
                  fill="url(#cpiGradient)"
                  dot={{ fill: "#138808", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "#138808", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/30">
            <h4 className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wider">
              CPI by Category
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
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

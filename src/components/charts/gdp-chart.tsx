"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartTheme } from "@/components/ui/chart-tooltip";
import type { GDPDataPoint } from "@/lib/types";
import { motion } from "framer-motion";
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
  const { grid, axis, tick, tooltipStyle } = useChartTheme();

  const chartData = data.map((d) => ({
    period: `${d.quarter} ${d.year}`,
    gdpGrowth: d.gdpGrowth,
    agriculture: d.gvaAgriculture,
    industry: d.gvaIndustry,
    services: d.gvaServices,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="chart-container">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-saffron-600 flex items-center justify-center text-white shadow-sm">
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
                  d="M2 20h20M5 20V10l4-6 4 4 4-4 3 6v10"
                />
              </svg>
            </div>
            <div>
              <CardTitle>GDP Growth & GVA by Sector</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Quarterly GDP growth rate and Gross Value Added by sector (%)
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gdpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9933" stopOpacity={0.25} />
                    <stop offset="50%" stopColor="#ff9933" stopOpacity={0.08} />
                    <stop offset="95%" stopColor="#ff9933" stopOpacity={0} />
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
                  width={45}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(value: number) => [`${value.toFixed(1)}%`]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="gdpGrowth"
                  name="GDP Growth"
                  stroke="#ff9933"
                  strokeWidth={2.5}
                  fill="url(#gdpGradient)"
                  dot={{ fill: "#ff9933", strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, fill: "#ff9933", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/30">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
              GVA by Sector
            </h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                    unit="%"
                    width={45}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: number) => [`${value.toFixed(1)}%`]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                  />
                  <Bar
                    dataKey="agriculture"
                    name="Agriculture"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="industry"
                    name="Industry"
                    fill="#ff9933"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="services"
                    name="Services"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

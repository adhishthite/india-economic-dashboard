"use client";

import type { SummaryStats } from "@/lib/types";
import { motion } from "framer-motion";

interface SummaryCardsProps {
  stats: SummaryStats;
}

function TrendBadge({ trend, label }: { trend: "up" | "down" | "stable"; label: string }) {
  const config = {
    up: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200/60 dark:border-emerald-800/40",
      text: "text-emerald-700 dark:text-emerald-400",
      icon: "M5 10l7-7m0 0l7 7m-7-7v18",
    },
    down: {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200/60 dark:border-rose-800/40",
      text: "text-rose-700 dark:text-rose-400",
      icon: "M19 14l-7 7m0 0l-7-7m7 7V3",
    },
    stable: {
      bg: "bg-slate-50 dark:bg-slate-800/40",
      border: "border-slate-200/60 dark:border-slate-700/40",
      text: "text-slate-600 dark:text-slate-400",
      icon: "M5 12h14",
    },
  };

  const c = config[trend];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border ${c.bg} ${c.border} ${c.text}`}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={c.icon} />
      </svg>
      {label}
    </span>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  period: string;
  trend: "up" | "down" | "stable";
  icon: React.ReactNode;
  accentFrom: string;
  accentTo: string;
  description: string;
  trendLabel: string;
  index: number;
}

function StatCard({
  title,
  value,
  unit,
  period,
  trend,
  icon,
  accentFrom,
  accentTo,
  description,
  trendLabel,
  index,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="stat-card glass-card rounded-2xl p-5 relative overflow-hidden group"
    >
      {/* Subtle gradient accent in corner */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-500 bg-gradient-to-br ${accentFrom} ${accentTo}`}
        aria-hidden="true"
      />

      <div className="relative">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentFrom} ${accentTo} flex items-center justify-center text-white shadow-sm`}
            >
              {icon}
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {title}
            </span>
          </div>
          <TrendBadge trend={trend} label={trendLabel} />
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5 mb-1.5">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums tracking-tight animate-count">
            {value.toFixed(1)}
          </span>
          <span className="text-base font-medium text-slate-400 dark:text-slate-500">{unit}</span>
        </div>

        {/* Period and description */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{period}</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{description}</p>
      </div>
    </motion.div>
  );
}

// Icon components
function GDPIcon() {
  return (
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
  );
}

function CPIIcon() {
  return (
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
  );
}

function WPIIcon() {
  return (
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
        d="M20 12H4m16 0l-4-4m4 4l-4 4M4 12l4-4M4 12l4 4"
      />
    </svg>
  );
}

function IIPIcon() {
  return (
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
  );
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="GDP Growth"
        value={stats.gdpGrowth.value}
        unit="%"
        period={stats.gdpGrowth.quarter}
        trend={stats.gdpGrowth.trend}
        icon={<GDPIcon />}
        accentFrom="from-saffron-500"
        accentTo="to-saffron-600"
        description="Real GDP year-on-year growth"
        trendLabel={
          stats.gdpGrowth.trend === "up"
            ? "Rising"
            : stats.gdpGrowth.trend === "down"
              ? "Falling"
              : "Steady"
        }
        index={0}
      />
      <StatCard
        title="CPI Inflation"
        value={stats.cpiInflation.value}
        unit="%"
        period={stats.cpiInflation.month}
        trend={stats.cpiInflation.trend}
        icon={<CPIIcon />}
        accentFrom="from-emerald-500"
        accentTo="to-emerald-600"
        description="Consumer price index inflation"
        trendLabel={
          stats.cpiInflation.trend === "up"
            ? "Rising"
            : stats.cpiInflation.trend === "down"
              ? "Falling"
              : "Steady"
        }
        index={1}
      />
      <StatCard
        title="WPI Inflation"
        value={stats.wpiInflation.value}
        unit="%"
        period={stats.wpiInflation.month}
        trend={stats.wpiInflation.trend}
        icon={<WPIIcon />}
        accentFrom="from-blue-500"
        accentTo="to-blue-600"
        description="Wholesale price index inflation"
        trendLabel={
          stats.wpiInflation.trend === "up"
            ? "Rising"
            : stats.wpiInflation.trend === "down"
              ? "Falling"
              : "Steady"
        }
        index={2}
      />
      <StatCard
        title="IIP Growth"
        value={stats.iipGrowth.value}
        unit="%"
        period={stats.iipGrowth.month}
        trend={stats.iipGrowth.trend}
        icon={<IIPIcon />}
        accentFrom="from-violet-500"
        accentTo="to-violet-600"
        description="Index of industrial production"
        trendLabel={
          stats.iipGrowth.trend === "up"
            ? "Rising"
            : stats.iipGrowth.trend === "down"
              ? "Falling"
              : "Steady"
        }
        index={3}
      />
    </div>
  );
}

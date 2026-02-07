"use client";

import type { SummaryStats } from "@/lib/types";

interface SummaryCardsProps {
  stats: SummaryStats;
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") {
    return (
      <svg
        className="w-4 h-4 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    );
  }
  if (trend === "down") {
    return (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    );
  }
  return (
    <svg
      className="w-4 h-4 text-neutral-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
    </svg>
  );
}

interface StatCardProps {
  title: string;
  value: number;
  unit: string;
  period: string;
  trend: "up" | "down" | "stable";
  accentColor: string;
  description: string;
}

function StatCard({ title, value, unit, period, trend, accentColor, description }: StatCardProps) {
  return (
    <div className="stat-card bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${accentColor}`} aria-hidden="true" />
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">{title}</span>
        <TrendIcon trend={trend} />
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <span className="text-3xl font-bold text-neutral-900 dark:text-white">
          {value.toFixed(2)}
        </span>
        <span className="text-lg text-neutral-500 dark:text-neutral-400">{unit}</span>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">{period}</p>
      <p className="text-xs text-neutral-400 dark:text-neutral-500">{description}</p>
    </div>
  );
}

export function SummaryCards({ stats }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="GDP Growth Rate"
        value={stats.gdpGrowth.value}
        unit="%"
        period={stats.gdpGrowth.quarter}
        trend={stats.gdpGrowth.trend}
        accentColor="bg-india-saffron"
        description="Real GDP year-on-year growth"
      />
      <StatCard
        title="CPI Inflation"
        value={stats.cpiInflation.value}
        unit="%"
        period={stats.cpiInflation.month}
        trend={stats.cpiInflation.trend}
        accentColor="bg-india-green"
        description="Consumer price index inflation"
      />
      <StatCard
        title="WPI Inflation"
        value={stats.wpiInflation.value}
        unit="%"
        period={stats.wpiInflation.month}
        trend={stats.wpiInflation.trend}
        accentColor="bg-blue-500"
        description="Wholesale price index inflation"
      />
      <StatCard
        title="IIP Growth"
        value={stats.iipGrowth.value}
        unit="%"
        period={stats.iipGrowth.month}
        trend={stats.iipGrowth.trend}
        accentColor="bg-purple-500"
        description="Index of industrial production"
      />
    </div>
  );
}

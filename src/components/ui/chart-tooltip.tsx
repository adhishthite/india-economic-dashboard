"use client";

import { useTheme } from "@/components/theme-provider";

export function useChartTheme() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return {
    isDark,
    grid: isDark ? "#334155" : "#e2e8f0",
    axis: isDark ? "#475569" : "#cbd5e1",
    tick: isDark ? "#94a3b8" : "#64748b",
    tooltipBg: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
    tooltipBorder: isDark ? "rgba(51, 65, 85, 0.6)" : "rgba(226, 232, 240, 0.8)",
    tooltipStyle: {
      backgroundColor: isDark ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.95)",
      borderRadius: "12px",
      border: isDark ? "1px solid rgba(51, 65, 85, 0.6)" : "1px solid rgba(226, 232, 240, 0.8)",
      boxShadow: isDark ? "0 4px 12px rgba(0, 0, 0, 0.4)" : "0 4px 12px rgba(0, 0, 0, 0.08)",
      padding: "12px 14px",
      color: isDark ? "#e2e8f0" : "#0f172a",
      fontSize: "12px",
    } as React.CSSProperties,
  };
}

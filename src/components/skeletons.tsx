import type { CSSProperties } from "react";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

function Skeleton({ className = "", style }: SkeletonProps) {
  return <div className={`skeleton rounded-lg ${className}`} style={style} aria-hidden="true" />;
}

/**
 * Matches the StatCard layout in summary-cards.tsx:
 * - header row: icon box (w-9 h-9) + title label + trend badge
 * - large value + unit
 * - period text
 * - description text
 */
export function SummaryCardSkeleton() {
  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
      {/* Header row: icon + label + trend badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-9 w-9 rounded-xl" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>

      {/* Value row */}
      <div className="flex items-baseline gap-1.5 mb-1.5">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-5 w-5" />
      </div>

      {/* Period */}
      <Skeleton className="h-3 w-24 mb-1" />
      {/* Description */}
      <Skeleton className="h-3 w-36" />
    </div>
  );
}

/**
 * Matches the chart Card layout used by GDP/CPI/WPI/IIP charts:
 * - CardHeader: icon box (w-8 h-8) + title + subtitle
 * - CardContent: primary chart area + divider + secondary chart area
 */
export function ChartSkeleton() {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* CardHeader */}
      <div className="px-6 py-5 border-b border-slate-200/60 dark:border-slate-700/40">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-8 w-8 rounded-lg" />
          <div className="flex-1">
            <Skeleton className="h-4 w-48 mb-1.5" />
            <Skeleton className="h-3 w-72" />
          </div>
        </div>
      </div>

      {/* CardContent */}
      <div className="px-6 py-5">
        {/* Section label */}
        <Skeleton className="h-3 w-28 mb-3" />
        {/* Primary chart area - matches h-72/h-80 */}
        <div className="h-72 w-full flex flex-col justify-end gap-1.5 pb-4">
          {/* Fake chart bars / lines */}
          <div className="flex items-end gap-2 h-full px-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`bar-${i.toString()}`} className="flex-1 flex flex-col justify-end h-full">
                <Skeleton
                  className="w-full rounded-t-sm"
                  style={{ height: `${20 + Math.sin(i * 0.8) * 30 + 30}%` }}
                />
              </div>
            ))}
          </div>
          {/* X-axis line */}
          <Skeleton className="h-px w-full" />
        </div>

        {/* Divider + secondary chart */}
        <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-700/30">
          <Skeleton className="h-3 w-24 mb-3" />
          <div className="h-56 w-full flex flex-col justify-end gap-1.5 pb-4">
            <div className="flex items-end gap-2 h-full px-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={`bar2-${i.toString()}`}
                  className="flex-1 flex flex-col justify-end h-full"
                >
                  <Skeleton
                    className="w-full rounded-t-sm"
                    style={{ height: `${25 + Math.cos(i * 0.6) * 25 + 25}%` }}
                  />
                </div>
              ))}
            </div>
            <Skeleton className="h-px w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Loading message shown while data is fetched from MoSPI.
 */
function LoadingMessage() {
  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-india-saffron opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-india-saffron" />
        </span>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Loading live data from MoSPI...
        </span>
      </div>
    </div>
  );
}

/**
 * Full dashboard skeleton: loading banner + 4 summary cards + chart skeletons
 * matching the overview tab layout.
 */
export function DashboardSkeleton() {
  return (
    <div>
      <LoadingMessage />

      {/* Summary cards row */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>
      </section>

      {/* Chart skeletons matching overview layout */}
      <div className="space-y-6">
        {/* GDP - full width */}
        <ChartSkeleton />

        {/* CPI + WPI side by side */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        {/* IIP - full width */}
        <ChartSkeleton />
      </div>
    </div>
  );
}

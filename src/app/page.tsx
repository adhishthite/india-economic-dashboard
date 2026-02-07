"use client";

import { CPIChart, GDPChart, IIPChart, WPIChart } from "@/components/charts";
import { Header } from "@/components/header";
import { SummaryCards } from "@/components/summary-cards";
import { cpiData, gdpData, iipData, summaryStats, wpiData } from "@/lib/mock-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Key Economic Indicators
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Real-time data from the Ministry of Statistics and Programme Implementation (MoSPI)
          </p>
        </div>

        {/* Summary Cards */}
        <section className="mb-8">
          <SummaryCards stats={summaryStats} />
        </section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* GDP Chart */}
          <section className="xl:col-span-2">
            <GDPChart data={gdpData} />
          </section>

          {/* CPI Chart */}
          <section>
            <CPIChart data={cpiData} />
          </section>

          {/* WPI Chart */}
          <section>
            <WPIChart data={wpiData} />
          </section>

          {/* IIP Chart */}
          <section className="xl:col-span-2">
            <IIPChart data={iipData} />
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Data Source:{" "}
              <a
                href="https://esankhyiki.mospi.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-india-saffron hover:underline"
              >
                eSankhyiki - MoSPI
              </a>
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-IN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-4 text-center">
            This dashboard displays sample data for demonstration purposes. For official statistics,
            please visit the{" "}
            <a
              href="https://mospi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              Ministry of Statistics and Programme Implementation
            </a>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}

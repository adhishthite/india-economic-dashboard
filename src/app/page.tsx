"use client";

import { CPIChart, GDPChart, IIPChart, WPIChart } from "@/components/charts";
import { Header, type TabId } from "@/components/header";
import { SummaryCards } from "@/components/summary-cards";
import { cpiData, gdpData, iipData, summaryStats, wpiData } from "@/lib/mock-data";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const sectionDescriptions: Record<TabId, { title: string; subtitle: string }> = {
  overview: {
    title: "Key Economic Indicators",
    subtitle: "Real-time data from the Ministry of Statistics and Programme Implementation (MoSPI)",
  },
  gdp: {
    title: "Gross Domestic Product",
    subtitle: "Quarterly GDP growth rate and sectoral Gross Value Added breakdown",
  },
  cpi: {
    title: "Consumer Price Index",
    subtitle: "Monthly CPI inflation tracking with RBI target band analysis",
  },
  wpi: {
    title: "Wholesale Price Index",
    subtitle: "Monthly WPI inflation and commodity group index trends",
  },
  iip: {
    title: "Industrial Production",
    subtitle: "Monthly IIP growth rate with sectoral breakdown and radar analysis",
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const showChart = (chart: TabId) => activeTab === "overview" || activeTab === chart;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f1a] mesh-gradient">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {sectionDescriptions[activeTab].title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {sectionDescriptions[activeTab].subtitle}
          </p>
        </motion.div>

        {/* Summary Cards - visible on overview */}
        {activeTab === "overview" && (
          <section className="mb-10">
            <SummaryCards stats={summaryStats} />
          </section>
        )}

        {/* Charts */}
        <AnimatePresence mode="wait">
          <div className="space-y-6">
            {showChart("gdp") && (
              <section key="gdp">
                <GDPChart data={gdpData} />
              </section>
            )}

            {activeTab === "overview" && (
              <div key="cpi-wpi-grid" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section>
                  <CPIChart data={cpiData} />
                </section>
                <section>
                  <WPIChart data={wpiData} />
                </section>
              </div>
            )}

            {activeTab === "cpi" && (
              <section key="cpi-full">
                <CPIChart data={cpiData} />
              </section>
            )}

            {activeTab === "wpi" && (
              <section key="wpi-full">
                <WPIChart data={wpiData} />
              </section>
            )}

            {showChart("iip") && (
              <section key="iip">
                <IIPChart data={iipData} />
              </section>
            )}
          </div>
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-slate-200/60 dark:border-slate-700/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-0.5">
                <div className="w-1 h-4 bg-india-saffron rounded-full" />
                <div className="w-1 h-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
                <div className="w-1 h-4 bg-india-green rounded-full" />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                India Economic Dashboard
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
              <span>
                Source:{" "}
                <a
                  href="https://esankhyiki.mospi.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-india-saffron hover:underline font-medium"
                >
                  eSankhyiki - MoSPI
                </a>
              </span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:inline">
                Updated{" "}
                {new Date().toLocaleDateString("en-IN", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-4 text-center leading-relaxed">
            Sample data for demonstration purposes. For official statistics, visit{" "}
            <a
              href="https://mospi.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              mospi.gov.in
            </a>
          </p>
        </footer>
      </main>
    </div>
  );
}

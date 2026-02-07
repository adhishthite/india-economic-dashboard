import { fetchSummaryStats } from "@/lib/data-fetchers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 21600; // 6 hours

export async function GET() {
  try {
    const data = await fetchSummaryStats();
    return NextResponse.json({
      data,
      lastUpdated: new Date().toISOString(),
      source: "MoSPI - Summary Statistics",
    });
  } catch (error) {
    console.error("Summary fetch error:", error);
    return NextResponse.json(
      { error: "Data temporarily unavailable", data: null },
      { status: 503 }
    );
  }
}

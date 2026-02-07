import { fetchWPIData } from "@/lib/data-fetchers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 21600; // 6 hours

export async function GET() {
  try {
    const data = await fetchWPIData();
    return NextResponse.json({
      data,
      lastUpdated: new Date().toISOString(),
      source: "MoSPI - Wholesale Price Index",
    });
  } catch (error) {
    console.error("WPI fetch error:", error);
    return NextResponse.json(
      { error: "Data temporarily unavailable", data: null },
      { status: 503 }
    );
  }
}

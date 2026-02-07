import { fetchGDPData } from "@/lib/data-fetchers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 21600; // 6 hours

export async function GET() {
  try {
    const data = await fetchGDPData();
    return NextResponse.json({
      data,
      lastUpdated: new Date().toISOString(),
      source: "MoSPI - National Accounts Statistics",
    });
  } catch (error) {
    console.error("GDP fetch error:", error);
    return NextResponse.json(
      { error: "Data temporarily unavailable", data: null },
      { status: 503 }
    );
  }
}

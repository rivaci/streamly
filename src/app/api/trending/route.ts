import { NextResponse } from "next/server";
import { getTrending } from "@/lib/tmdb";

/**
 * GET /api/trending?type=movie|tv|all&window=day|week
 *
 * Demonstrates a Route Handler that mirrors the home page data,
 * cached at the network layer (TMDB fetch revalidate + Next response cache).
 */
export const revalidate = 1800;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const typeParam = url.searchParams.get("type") || "all";
  const windowParam = url.searchParams.get("window") || "week";

  const type = (["movie", "tv", "all"].includes(typeParam)
    ? typeParam
    : "all") as "movie" | "tv" | "all";
  const window = (windowParam === "day" ? "day" : "week") as "day" | "week";

  try {
    const titles = await getTrending(type, window);
    return NextResponse.json(
      { count: titles.length, results: titles.slice(0, 20) },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=1800, stale-while-revalidate=86400",
        },
      },
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "unknown" },
      { status: 502 },
    );
  }
}

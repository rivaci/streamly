import { NextResponse } from "next/server";
import { getSeasonDetail } from "@/lib/tmdb";

interface RouteContext {
  params: Promise<{ id: string; n: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id, n } = await context.params;
  const tvId = Number.parseInt(id, 10);
  const seasonNum = Number.parseInt(n, 10);

  if (!Number.isFinite(tvId) || !Number.isFinite(seasonNum)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  try {
    const season = await getSeasonDetail(tvId, seasonNum);
    return NextResponse.json(season, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

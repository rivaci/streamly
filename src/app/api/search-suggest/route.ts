import { NextResponse, type NextRequest } from "next/server";
import { searchMulti } from "@/lib/tmdb";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json([]);
  }

  const results = await searchMulti(q);
  const suggestions = results.slice(0, 8).map((t) => ({
    id: t.id,
    type: t.type,
    title: t.title,
    year: t.year,
    poster_url: t.poster_url,
  }));

  return NextResponse.json(suggestions, {
    headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
  });
}

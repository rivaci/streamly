import { NextResponse, type NextRequest } from "next/server";
import { getTitleDetail, type TitleType } from "@/lib/tmdb";

function isType(v: string): v is TitleType {
  return v === "movie" || v === "tv";
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const type = searchParams.get("type") ?? "";
  const id = searchParams.get("id") ?? "";

  if (!isType(type) || !id) {
    return NextResponse.json({ error: "Missing type or id" }, { status: 400 });
  }

  const numId = Number.parseInt(id, 10);
  if (!Number.isFinite(numId)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const detail = await getTitleDetail(type, numId);
    return NextResponse.json(
      {
        trailer_key: detail.trailer_key,
        genres: detail.genres,
        runtime: detail.runtime,
        vote_average: detail.vote_average,
        overview: detail.overview,
      },
      {
        headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" },
      },
    );
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

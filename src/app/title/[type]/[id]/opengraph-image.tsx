import { ImageResponse } from "next/og";
import { getTitleDetail, type TitleType } from "@/lib/tmdb";

export const runtime = "edge";
export const alt = "Title poster";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function isType(v: string): v is TitleType {
  return v === "movie" || v === "tv";
}

export default async function OgImage({
  params,
}: {
  params: Promise<{ type: string; id: string }>;
}) {
  const { type, id } = await params;
  if (!isType(type)) return new Response("Not found", { status: 404 });

  const numId = Number.parseInt(id, 10);
  if (!Number.isFinite(numId)) return new Response("Not found", { status: 404 });

  const detail = await getTitleDetail(type, numId);
  const backdrop = detail.backdrop_url;
  const year = detail.year ?? "";
  const genres = detail.genres.slice(0, 3).join(" · ");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          position: "relative",
        }}
      >
        {backdrop && (
          <img
            src={backdrop}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "60px",
            width: "100%",
            height: "100%",
            position: "relative",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "28px",
                fontWeight: 700,
                color: "#e50914",
              }}
            >
              <span>▶</span>
              <span>Streamly</span>
            </div>
          </div>
          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "white",
              lineHeight: 1.1,
              marginBottom: "12px",
              maxWidth: "900px",
            }}
          >
            {detail.title}
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              fontSize: "24px",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {year && <span>{year}</span>}
            {genres && <span>{genres}</span>}
            {detail.vote_average > 0 && (
              <span>★ {detail.vote_average.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

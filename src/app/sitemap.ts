import type { MetadataRoute } from "next";
import { getTrending } from "@/lib/tmdb";
import { getAllSlugs } from "@/lib/genre-slugs";

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "https://streamly.example.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/movies`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/tv`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE}/discover`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/watchlist`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const genreRoutes: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${BASE}/genre/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  let titleRoutes: MetadataRoute.Sitemap = [];
  try {
    const trending = await getTrending("all", "week");
    titleRoutes = trending.slice(0, 200).map((t) => ({
      url: `${BASE}/title/${t.type}/${t.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // TMDB unavailable — sitemap still generates with static routes
  }

  return [...staticRoutes, ...genreRoutes, ...titleRoutes];
}

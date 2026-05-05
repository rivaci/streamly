import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { HomepageHero } from "@/components/home/HomepageHero";
import { discover, getTitleDetail } from "@/lib/tmdb";
import { getGenreBySlug, getAllSlugs } from "@/lib/genre-slugs";
import { getServerT } from "@/i18n/server";

export const dynamic = "force-static";
export const revalidate = 21_600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const genre = getGenreBySlug(slug);
  if (!genre) return {};
  return { title: `${genre.labelEn} Movies — Streamly` };
}

export default async function GenrePage({ params }: PageProps) {
  const { slug } = await params;
  const genre = getGenreBySlug(slug);
  if (!genre) notFound();

  const { t, tmdbLanguage, locale } = await getServerT();
  const label = locale === "fr" ? genre.labelFr : genre.labelEn;

  const titles = await discover(
    "movie",
    { genres: [genre.id] },
    { language: tmdbLanguage },
  );
  const featured = titles[0];
  const featuredDetail = featured
    ? await getTitleDetail(featured.type, featured.id, { language: tmdbLanguage })
    : null;

  return (
    <>
      <h1 className="sr-only">{t("genre.pageTitle", { genre: label })}</h1>
      {featuredDetail && (
        <HomepageHero
          title={featuredDetail}
          scoreLabel={t("title.score")}
          moreInfoLabel={t("title.moreInfo")}
        />
      )}
      <Container className="pb-10 pt-6">
        <CatalogGrid titles={titles} priorityCount={6} />
      </Container>
    </>
  );
}

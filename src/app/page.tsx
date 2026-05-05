import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { CatalogSection } from "@/components/catalog/CatalogSection";
import { Skeleton } from "@/components/ui/Skeleton";
import { HomepageHero } from "@/components/home/HomepageHero";
import { TrendingToggle } from "@/components/home/TrendingToggle";
import { RecentlyViewedSection } from "@/components/home/RecentlyViewedSection";
import { discover, getTrending, getTitleDetail } from "@/lib/tmdb";
import { getServerT } from "@/i18n/server";

export const revalidate = 1800;

interface HomePageProps {
  searchParams: Promise<{ trending?: string }>;
}

async function HeroSection({ window }: { window: "day" | "week" }) {
  const { t, tmdbLanguage } = await getServerT();
  const trending = await getTrending("all", window, { language: tmdbLanguage });
  const featured = trending[0];
  if (!featured) return null;

  const detail = await getTitleDetail(featured.type, featured.id, {
    language: tmdbLanguage,
  });

  return (
    <HomepageHero
      title={detail}
      scoreLabel={t("title.score")}
      moreInfoLabel={t("title.moreInfo")}
    />
  );
}

async function TrendingSection({ window }: { window: "day" | "week" }) {
  const { t, tmdbLanguage } = await getServerT();
  const trending = await getTrending("all", window, { language: tmdbLanguage });
  return (
    <CatalogSection
      title={t("home.trendingTitle")}
      action={
        <Suspense>
          <TrendingToggle />
        </Suspense>
      }
    >
      <CatalogGrid titles={trending.slice(0, 12)} priorityCount={6} />
    </CatalogSection>
  );
}

async function PopularMoviesSection() {
  const { t, tmdbLanguage } = await getServerT();
  const movies = await discover(
    "movie",
    { sortBy: "popularity" },
    { language: tmdbLanguage },
  );
  return (
    <CatalogSection title={t("home.moviesTitle")}>
      <CatalogGrid titles={movies.slice(0, 12)} priorityCount={0} />
    </CatalogSection>
  );
}

async function PopularTvSection() {
  const { t, tmdbLanguage } = await getServerT();
  const tv = await discover(
    "tv",
    { sortBy: "popularity" },
    { language: tmdbLanguage },
  );
  return (
    <CatalogSection title={t("home.tvTitle")}>
      <CatalogGrid titles={tv.slice(0, 12)} priorityCount={0} />
    </CatalogSection>
  );
}

function HeroSkeleton() {
  return <Skeleton className="h-[70vh] w-full" />;
}

function GridSkeleton() {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <li key={i}>
          <Skeleton className="aspect-poster w-full" />
          <Skeleton className="mt-2 h-4 w-3/4" />
          <Skeleton className="mt-1 h-3 w-1/2" />
        </li>
      ))}
    </ul>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { trending } = await searchParams;
  const window = trending === "day" ? "day" : "week";

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <HeroSection window={window} />
      </Suspense>
      <Container className="pb-12 pt-6">
        <RecentlyViewedSection />
        <Suspense fallback={<GridSkeleton />}>
          <TrendingSection window={window} />
        </Suspense>
        <Suspense fallback={<GridSkeleton />}>
          <PopularMoviesSection />
        </Suspense>
        <Suspense fallback={<GridSkeleton />}>
          <PopularTvSection />
        </Suspense>
      </Container>
    </>
  );
}

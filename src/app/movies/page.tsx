import { Container } from "@/components/ui/Container";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { HomepageHero } from "@/components/home/HomepageHero";
import { discover, getTitleDetail } from "@/lib/tmdb";
import { getServerT } from "@/i18n/server";

export const revalidate = 1800;

export default async function MoviesPage() {
  const { t, tmdbLanguage } = await getServerT();
  const movies = await discover(
    "movie",
    { sortBy: "popularity" },
    { language: tmdbLanguage },
  );
  const featured = movies[0];
  const featuredDetail = featured
    ? await getTitleDetail(featured.type, featured.id, { language: tmdbLanguage })
    : null;
  return (
    <>
      <h1 className="sr-only">{t("home.moviesTitle")}</h1>
      {featuredDetail && (
        <HomepageHero
          title={featuredDetail}
          scoreLabel={t("title.score")}
          moreInfoLabel={t("title.moreInfo")}
        />
      )}
      <Container className="pb-10 pt-6">
        <CatalogGrid titles={movies} priorityCount={6} />
      </Container>
    </>
  );
}

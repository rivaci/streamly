import { Container } from "@/components/ui/Container";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { discover, loadGenres, STREAMING_PROVIDERS } from "@/lib/tmdb";
import { getServerT } from "@/i18n/server";
import { parse } from "@/lib/discover-params";
import { FilterBar } from "@/components/discover/FilterBar";

export const revalidate = 1800;

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function DiscoverPage({ searchParams }: PageProps) {
  const rawParams = await searchParams;
  const filters = parse(rawParams);
  const { t, tmdbLanguage } = await getServerT();

  const [results, genres] = await Promise.all([
    discover(
      filters.type,
      {
        genres: filters.genres,
        yearMin: filters.yearMin,
        yearMax: filters.yearMax,
        voteMin: filters.voteMin,
        providers: filters.providers,
        sortBy: filters.sort,
      },
      { language: tmdbLanguage },
    ),
    loadGenres(filters.type, tmdbLanguage),
  ]);

  const genreList = Array.from(genres.entries()).map(([id, name]) => ({
    id,
    name,
  }));

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {t("discover.pageTitle")}
      </h1>
      <div className="mt-6">
        <FilterBar
          initialFilters={filters}
          genres={genreList}
          providers={STREAMING_PROVIDERS.map((p) => ({
            id: p.id,
            name: p.name,
          }))}
        />
      </div>
      <div className="mt-6">
        <CatalogGrid titles={results} priorityCount={6} />
      </div>
    </Container>
  );
}

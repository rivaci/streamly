import { Container } from "@/components/ui/Container";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { searchMulti } from "@/lib/tmdb";
import { getServerT } from "@/i18n/server";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

// Search is dynamic but TMDB results cached 5 min server-side via tmdbGet.
export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const { t, tmdbLanguage } = await getServerT();
  const results = query
    ? await searchMulti(query, { language: tmdbLanguage })
    : [];

  return (
    <Container className="py-8">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {query
          ? t("search.resultsTitle", { query })
          : t("nav.search")}
      </h1>
      <div className="mt-6">
        <CatalogGrid
          titles={results}
          priorityCount={0}
          emptyMessage={
            query ? t("search.noResults", { query }) : t("search.placeholder")
          }
        />
      </div>
    </Container>
  );
}

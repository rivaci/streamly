import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TitleHero } from "@/components/title/TitleHero";
import { CastList } from "@/components/title/CastList";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { getCredits, getSimilar, getTitleDetail, type TitleType } from "@/lib/tmdb";
import { getServerT } from "@/i18n/server";
import { RecordView } from "@/components/title/RecordView";
import { SeasonsAccordion } from "@/components/title/SeasonsAccordion";

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

// SSR — but cached at the network layer via the TMDB fetch revalidate.
export const dynamic = "force-static";
export const revalidate = 21_600; // 6h

function isType(v: string): v is TitleType {
  return v === "movie" || v === "tv";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { type, id } = await params;
  if (!isType(type)) return {};
  const numId = Number.parseInt(id, 10);
  if (!Number.isFinite(numId)) return {};
  try {
    const { tmdbLanguage } = await getServerT();
    const detail = await getTitleDetail(type, numId, { language: tmdbLanguage });
    return {
      title: detail.title,
      description: detail.overview?.slice(0, 160),
      openGraph: {
        title: detail.title,
        description: detail.overview?.slice(0, 160),
        images: detail.backdrop_url ? [detail.backdrop_url] : undefined,
      },
    };
  } catch {
    return {};
  }
}

export default async function TitleDetailPage({ params }: PageProps) {
  const { type, id } = await params;
  if (!isType(type)) notFound();
  const numId = Number.parseInt(id, 10);
  if (!Number.isFinite(numId)) notFound();

  const { t, tmdbLanguage } = await getServerT();

  let detail: Awaited<ReturnType<typeof getTitleDetail>>;
  try {
    detail = await getTitleDetail(type, numId, { language: tmdbLanguage });
  } catch {
    notFound();
  }

  const [credits, similar] = await Promise.all([
    getCredits(type, numId, { language: tmdbLanguage }),
    getSimilar(type, numId, { language: tmdbLanguage }),
  ]);

  return (
    <>
      <RecordView
        type={detail.type}
        id={detail.id}
        title={detail.title}
        poster_url={detail.poster_url}
        year={detail.year}
      />
      <TitleHero
        title={detail}
        scoreLabel={t("title.score")}
        runtimeLabel={(min) => t("title.runtime", { minutes: min })}
        seasonsLabel={(count) => t("title.seasons", { count })}
      />
      <Container className="py-10">
        <div className="space-y-10">
          {detail.type === "tv" && (detail.number_of_seasons ?? 0) > 0 && (
            <SeasonsAccordion tvId={detail.id} numberOfSeasons={detail.number_of_seasons!} />
          )}
          {credits.length > 0 && (
            <section aria-labelledby="cast-heading">
              <h2 id="cast-heading" className="mb-4 text-xl font-semibold">
                {t("title.cast")}
              </h2>
              <CastList cast={credits} />
            </section>
          )}
          {similar.length > 0 && (
            <section aria-labelledby="similar-heading">
              <h2 id="similar-heading" className="mb-4 text-xl font-semibold">
                {t("title.similar")}
              </h2>
              <CatalogGrid titles={similar.slice(0, 12)} priorityCount={0} />
            </section>
          )}
        </div>
      </Container>
    </>
  );
}

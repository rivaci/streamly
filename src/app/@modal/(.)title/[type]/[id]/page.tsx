import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { TitleHero } from "@/components/title/TitleHero";
import { CastList } from "@/components/title/CastList";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { getCredits, getSimilar, getTitleDetail, type TitleType } from "@/lib/tmdb";
import { getServerT } from "@/i18n/server";
import { TitleDetailModal } from "@/components/title/TitleDetailModal";
import { SeasonsAccordion } from "@/components/title/SeasonsAccordion";

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

function isType(v: string): v is TitleType {
  return v === "movie" || v === "tv";
}

export default async function ModalTitleDetailPage({ params }: PageProps) {
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
    <TitleDetailModal>
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
            <section aria-labelledby="modal-cast-heading">
              <h2 id="modal-cast-heading" className="mb-4 text-xl font-semibold">
                {t("title.cast")}
              </h2>
              <CastList cast={credits} />
            </section>
          )}
          {similar.length > 0 && (
            <section aria-labelledby="modal-similar-heading">
              <h2 id="modal-similar-heading" className="mb-4 text-xl font-semibold">
                {t("title.similar")}
              </h2>
              <CatalogGrid titles={similar.slice(0, 12)} priorityCount={0} />
            </section>
          )}
        </div>
      </Container>
    </TitleDetailModal>
  );
}

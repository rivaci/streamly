import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CatalogGrid } from "@/components/catalog/CatalogGrid";
import { PersonHero } from "@/components/person/PersonHero";
import { getPerson, getPersonCredits } from "@/lib/tmdb";
import { getServerT } from "@/i18n/server";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-static";
export const revalidate = 86_400; // 24h

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const numId = Number.parseInt(id, 10);
  if (!Number.isFinite(numId)) return {};
  try {
    const { tmdbLanguage } = await getServerT();
    const person = await getPerson(numId, { language: tmdbLanguage });
    return {
      title: person.name,
      description: person.biography?.slice(0, 160),
    };
  } catch {
    return {};
  }
}

export default async function PersonPage({ params }: PageProps) {
  const { id } = await params;
  const numId = Number.parseInt(id, 10);
  if (!Number.isFinite(numId)) notFound();

  const { t, tmdbLanguage } = await getServerT();

  let person: Awaited<ReturnType<typeof getPerson>>;
  try {
    person = await getPerson(numId, { language: tmdbLanguage });
  } catch {
    notFound();
  }

  const { cast, crew } = await getPersonCredits(numId, {
    language: tmdbLanguage,
  });

  // Filmography: top 12 most recent acting credits + a "directed" section if any.
  const directed = crew
    .filter((c) => c.role.toLowerCase() === "director")
    .slice(0, 12);

  return (
    <>
      <PersonHero
        person={person}
        bornLabel={t("person.born")}
        fromLabel={t("person.from")}
        knownForLabel={t("person.knownFor")}
        biographyLabel={t("person.biography")}
      />
      <Container className="space-y-12 py-10">
        {cast.length > 0 && (
          <section aria-labelledby="filmography-heading">
            <h2 id="filmography-heading" className="mb-4 text-xl font-semibold">
              {t("person.filmography")}
            </h2>
            <CatalogGrid titles={cast.slice(0, 18)} priorityCount={0} />
          </section>
        )}
        {directed.length > 0 && (
          <section aria-labelledby="directed-heading">
            <h2 id="directed-heading" className="mb-4 text-xl font-semibold">
              {t("person.directedBy", { name: person.name })}
            </h2>
            <CatalogGrid titles={directed} priorityCount={0} />
          </section>
        )}
      </Container>
    </>
  );
}

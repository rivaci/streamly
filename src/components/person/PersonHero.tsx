import Image from "next/image";
import type { Person } from "@/lib/tmdb";
import { Container } from "@/components/ui/Container";

interface PersonHeroProps {
  person: Person;
  bornLabel: string;
  fromLabel: string;
  knownForLabel: string;
  biographyLabel: string;
}

function formatDate(iso: string | null, locale: string): string | null {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function PersonHero({
  person,
  bornLabel,
  fromLabel,
  knownForLabel,
  biographyLabel,
}: PersonHeroProps) {
  const birthday = formatDate(person.birthday, "fr-FR");
  return (
    <header className="bg-card">
      <Container className="grid gap-8 py-10 md:grid-cols-[220px_1fr] md:gap-12 md:py-14">
        <div>
          {person.profile_url ? (
            <Image
              src={person.profile_url}
              alt={person.name}
              width={220}
              height={330}
              priority
              className="mx-auto rounded-lg shadow-2xl"
            />
          ) : (
            <div className="mx-auto flex aspect-poster w-[220px] items-center justify-center rounded-lg bg-muted">
              <span className="text-sm text-muted-foreground">
                {person.name}
              </span>
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {person.name}
          </h1>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            {person.known_for_department && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {knownForLabel}
                </dt>
                <dd className="mt-0.5 font-medium">
                  {person.known_for_department}
                </dd>
              </div>
            )}
            {birthday && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {bornLabel}
                </dt>
                <dd className="mt-0.5 font-medium">{birthday}</dd>
              </div>
            )}
            {person.place_of_birth && (
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                  {fromLabel}
                </dt>
                <dd className="mt-0.5 font-medium">{person.place_of_birth}</dd>
              </div>
            )}
          </dl>
          {person.biography && (
            <section className="mt-6">
              <h2 className="text-lg font-semibold">{biographyLabel}</h2>
              <p className="mt-2 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {person.biography}
              </p>
            </section>
          )}
        </div>
      </Container>
    </header>
  );
}

import Image from "next/image";
import type { WatchProviders } from "@/lib/tmdb";

interface WatchProvidersListProps {
  providers: WatchProviders;
  watchOnLabel: string;
  rentLabel: string;
  buyLabel: string;
  notAvailableLabel: string;
}

export function WatchProvidersList({
  providers,
  watchOnLabel,
  rentLabel,
  buyLabel,
  notAvailableLabel,
}: WatchProvidersListProps) {
  const { flatrate, rent, buy, link } = providers;
  const nothing = !flatrate.length && !rent.length && !buy.length;
  if (nothing) {
    return (
      <p className="text-sm text-muted-foreground">{notAvailableLabel}</p>
    );
  }
  const Group = ({
    label,
    list,
  }: {
    label: string;
    list: WatchProviders["flatrate"];
  }) =>
    list.length ? (
      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <ul className="flex flex-wrap items-center gap-2">
          {list.map((p) => {
            const inner = (
              <>
                {p.logo_url ? (
                  <Image
                    src={p.logo_url}
                    alt={p.provider_name}
                    width={32}
                    height={32}
                    className="rounded"
                    unoptimized
                  />
                ) : (
                  <span className="text-xs">{p.provider_name}</span>
                )}
              </>
            );
            return (
              <li key={p.provider_id}>
                {link ? (
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={p.provider_name}
                    aria-label={p.provider_name}
                    className="block transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    {inner}
                  </a>
                ) : (
                  <span title={p.provider_name}>{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    ) : null;

  return (
    <div className="space-y-4">
      {flatrate.length > 0 && <Group label={watchOnLabel} list={flatrate} />}
      <Group label={rentLabel} list={rent} />
      <Group label={buyLabel} list={buy} />
    </div>
  );
}

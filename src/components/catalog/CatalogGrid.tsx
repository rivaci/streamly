import type { StreamingTitle } from "@/lib/tmdb";
import { TitleCard } from "./TitleCard";

interface CatalogGridProps {
  titles: StreamingTitle[];
  /** First N posters get `priority` to improve LCP. */
  priorityCount?: number;
  emptyMessage?: string;
}

export function CatalogGrid({
  titles,
  priorityCount = 6,
  emptyMessage,
}: CatalogGridProps) {
  if (!titles.length) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage ?? "—"}
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-2 gap-4 overflow-visible sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {titles.map((t, i) => (
        <li key={`${t.type}-${t.id}`}>
          <TitleCard title={t} priority={i < priorityCount} />
        </li>
      ))}
    </ul>
  );
}

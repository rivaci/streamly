"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/i18n/client";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export function RecentlyViewedSection() {
  const { t } = useI18n();
  const items = useRecentlyViewed();

  if (items.length === 0) return null;

  return (
    <section className="mt-10 first:mt-6">
      <h2 className="mb-4 text-xl font-semibold tracking-tight md:text-2xl">
        {t("home.recentlyViewed")}
      </h2>
      <div className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {items.map((item) => (
          <Link
            key={`${item.type}-${item.id}`}
            href={`/title/${item.type}/${item.id}`}
            className="group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="relative aspect-poster w-28 overflow-hidden rounded-lg bg-muted transition-transform duration-200 group-hover:scale-105 sm:w-32">
              {item.poster_url ? (
                <Image
                  src={item.poster_url}
                  alt={item.title}
                  fill
                  sizes="128px"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  {item.title}
                </div>
              )}
            </div>
            <p className="mt-1 w-28 truncate text-xs font-medium sm:w-32">
              {item.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

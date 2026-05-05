"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  useState,
  useRef,
  useCallback,
  useDeferredValue,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { useI18n } from "@/i18n/client";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Suggestion {
  id: number;
  type: "movie" | "tv";
  title: string;
  year: number | null;
  poster_url: string | null;
}

export function SearchBar() {
  const { t } = useI18n();
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("q") ?? "");
  const deferred = useDeferredValue(value);
  const debounced = useDebouncedValue(deferred, 200);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = "search-suggestions";

  useClickOutside(containerRef, () => setOpen(false));

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const ctrl = new AbortController();
    setLoading(true);
    fetch(`/api/search-suggest?q=${encodeURIComponent(debounced)}`, {
      signal: ctrl.signal,
    })
      .then((r) => r.json())
      .then((data: Suggestion[]) => {
        setSuggestions(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    return () => ctrl.abort();
  }, [debounced]);

  const navigate = useCallback(
    (type: string, id: number) => {
      setOpen(false);
      setValue("");
      router.push(`/title/${type}/${id}`);
    },
    [router],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        if (activeIndex >= 0) {
          e.preventDefault();
          const s = suggestions[activeIndex];
          if (s) navigate(s.type, s.id);
        }
        break;
      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  const activeId =
    activeIndex >= 0 ? `suggestion-${suggestions[activeIndex]?.id}` : undefined;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <form onSubmit={onSubmit} role="search">
        <label className="relative block">
          <span className="sr-only">{t("nav.search")}</span>
          <input
            ref={inputRef}
            type="search"
            name="q"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true);
            }}
            onKeyDown={onKeyDown}
            placeholder={t("search.placeholder")}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            autoComplete="off"
            className="h-9 w-full rounded-md border border-border bg-card px-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
          />
        </label>
      </form>

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-lg border border-border bg-card shadow-xl"
        >
          {loading && (
            <li className="px-3 py-2 text-xs text-muted-foreground">
              {t("search.suggesting")}
            </li>
          )}
          {suggestions.map((s, i) => (
            <li
              key={`${s.type}-${s.id}`}
              id={`suggestion-${s.id}`}
              role="option"
              aria-selected={i === activeIndex}
              onMouseEnter={() => setActiveIndex(i)}
              onClick={() => navigate(s.type, s.id)}
              className={`flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors ${i === activeIndex ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent/50"}`}
            >
              {s.poster_url ? (
                <Image
                  src={s.poster_url}
                  alt=""
                  width={32}
                  height={48}
                  className="shrink-0 rounded object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-12 w-8 shrink-0 items-center justify-center rounded bg-muted text-[10px] text-muted-foreground">
                  ?
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate font-medium">{s.title}</p>
                <p className="text-xs text-muted-foreground">
                  {[s.year, s.type === "tv" ? "TV" : "Film"]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

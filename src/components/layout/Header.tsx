import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SearchBar } from "./SearchBar";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { GenresMenu } from "./GenresMenu";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { getServerT } from "@/i18n/server";

export async function Header() {
  const { t } = await getServerT();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-14 items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-brand"
        >
          <span aria-hidden="true">▶</span>
          {t("app.name")}
        </Link>
        <nav aria-label="Primary" className="hidden gap-4 text-sm md:flex">
          <Link
            href="/"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.home")}
          </Link>
          <Link
            href="/movies"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.movies")}
          </Link>
          <Link
            href="/tv"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.tv")}
          </Link>
          <Link
            href="/discover"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.discover")}
          </Link>
          <GenresMenu />
          <Link
            href="/watchlist"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            {t("nav.watchlist")}
          </Link>
        </nav>
        <div className="ml-auto flex flex-1 items-center justify-end gap-3">
          <SearchBar />
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </Container>
    </header>
  );
}

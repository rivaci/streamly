import { Container } from "@/components/ui/Container";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-card/50">
      <Container className="flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          POC — Built with Next.js {15} · Data &amp; images by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            TMDB
          </a>{" "}
          (not endorsed by TMDB).
        </p>
        <p>© {new Date().getFullYear()} Streamly POC</p>
      </Container>
    </footer>
  );
}

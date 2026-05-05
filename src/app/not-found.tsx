import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { getServerT } from "@/i18n/server";

export default async function NotFound() {
  const { t } = await getServerT();
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-semibold">{t("title.notFound")}</h1>
      <Link
        href="/"
        className="mt-6 text-sm text-muted-foreground underline hover:text-foreground"
      >
        ← {t("nav.home")}
      </Link>
    </Container>
  );
}

"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/client";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error("[app error]", error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-semibold">{t("common.error")}</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {error.message}
      </p>
      <div className="mt-6">
        <Button variant="primary" onClick={reset}>
          {t("common.retry")}
        </Button>
      </div>
    </Container>
  );
}

import type { ReactNode } from "react";

interface CatalogSectionProps {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}

export function CatalogSection({ title, action, children }: CatalogSectionProps) {
  return (
    <section className="mt-10 first:mt-6">
      <header className="mb-4 flex items-end justify-between">
        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </h2>
        {action}
      </header>
      {children}
    </section>
  );
}

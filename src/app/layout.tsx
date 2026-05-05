import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import { I18nProvider } from "@/i18n/client";
import { getServerLocale } from "@/i18n/server";
import { dictionaries } from "@/i18n/config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Vitals } from "./_vitals";
import { VitalsPanel } from "@/components/dev/VitalsPanel";

export const metadata: Metadata = {
  title: {
    default: "Streamly — Streaming POC",
    template: "%s · Streamly",
  },
  description:
    "Streaming platform POC built with Next.js 15, TypeScript, TMDB. SSR/ISR, i18n FR/EN, accessibility, Core Web Vitals oriented.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  const locale = await getServerLocale();
  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("streamly:theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})();if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js").catch(function(){})`,
          }}
        />
      </head>
      <body>
        <I18nProvider locale={locale}>
          <Suspense>
            <Header />
          </Suspense>
          <main id="main">{children}</main>
          {modal}
          <Footer />
        </I18nProvider>
        <Vitals />
        <VitalsPanel />
        {/* Skip-link for keyboard users */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-brand focus:px-3 focus:py-1 focus:text-white"
        >
          {dictionaries[locale].common.back}
        </a>
      </body>
    </html>
  );
}

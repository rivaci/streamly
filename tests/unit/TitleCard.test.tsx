import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TitleCard } from "@/components/catalog/TitleCard";
import { I18nProvider } from "@/i18n/client";
import type { StreamingTitle } from "@/lib/tmdb";

const fixture: StreamingTitle = {
  id: 42,
  type: "movie",
  title: "Inception",
  original_title: "Inception",
  overview: "A thief who steals corporate secrets…",
  poster_url: "https://image.tmdb.org/t/p/w342/inception.jpg",
  backdrop_url: null,
  release_date: "2010-07-15",
  year: 2010,
  vote_average: 8.4,
  vote_count: 30000,
  genres: ["Action", "Sci-Fi"],
  popularity: 100,
};

describe("<TitleCard />", () => {
  it("renders title, year and links to the detail page", () => {
    render(
      <I18nProvider locale="fr">
        <TitleCard title={fixture} />
      </I18nProvider>,
    );
    const link = screen.getByRole("link", { name: /Inception \(2010\)/ });
    expect(link).toHaveAttribute("href", "/title/movie/42");
    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText(/2010/)).toBeInTheDocument();
    expect(screen.getByText(/8\.4/)).toBeInTheDocument();
  });
});

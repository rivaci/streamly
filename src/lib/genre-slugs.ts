export interface GenreEntry {
  slug: string;
  id: number;
  labelFr: string;
  labelEn: string;
}

export const GENRES: GenreEntry[] = [
  { slug: "action", id: 28, labelFr: "Action", labelEn: "Action" },
  { slug: "adventure", id: 12, labelFr: "Aventure", labelEn: "Adventure" },
  { slug: "animation", id: 16, labelFr: "Animation", labelEn: "Animation" },
  { slug: "comedy", id: 35, labelFr: "Comédie", labelEn: "Comedy" },
  { slug: "crime", id: 80, labelFr: "Crime", labelEn: "Crime" },
  { slug: "documentary", id: 99, labelFr: "Documentaire", labelEn: "Documentary" },
  { slug: "drama", id: 18, labelFr: "Drame", labelEn: "Drama" },
  { slug: "family", id: 10751, labelFr: "Famille", labelEn: "Family" },
  { slug: "fantasy", id: 14, labelFr: "Fantastique", labelEn: "Fantasy" },
  { slug: "history", id: 36, labelFr: "Histoire", labelEn: "History" },
  { slug: "horror", id: 27, labelFr: "Horreur", labelEn: "Horror" },
  { slug: "music", id: 10402, labelFr: "Musique", labelEn: "Music" },
  { slug: "mystery", id: 9648, labelFr: "Mystère", labelEn: "Mystery" },
  { slug: "romance", id: 10749, labelFr: "Romance", labelEn: "Romance" },
  { slug: "science-fiction", id: 878, labelFr: "Science-fiction", labelEn: "Science Fiction" },
  { slug: "thriller", id: 53, labelFr: "Thriller", labelEn: "Thriller" },
  { slug: "war", id: 10752, labelFr: "Guerre", labelEn: "War" },
  { slug: "western", id: 37, labelFr: "Western", labelEn: "Western" },
];

const bySlug = new Map(GENRES.map((g) => [g.slug, g]));

export function getGenreBySlug(slug: string): GenreEntry | undefined {
  return bySlug.get(slug);
}

export function getAllSlugs(): string[] {
  return GENRES.map((g) => g.slug);
}

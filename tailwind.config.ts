import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        brand: {
          DEFAULT: "#e50914",
          dark: "#b00710",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      aspectRatio: {
        poster: "2 / 3",
      },
    },
  },
  plugins: [],
};

export default config;

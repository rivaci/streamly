import { twMerge } from "tailwind-merge";

/** Classnames helper with Tailwind conflict resolution via tailwind-merge. */
export function cn(
  ...parts: Array<string | undefined | null | false>
): string {
  return twMerge(parts.filter(Boolean).join(" "));
}

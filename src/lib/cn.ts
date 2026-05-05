/** Tiny classnames helper (no clsx dependency to keep the bundle slim). */
export function cn(
  ...parts: Array<string | undefined | null | false>
): string {
  return parts.filter(Boolean).join(" ");
}

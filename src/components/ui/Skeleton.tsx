import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="loading"
      className={cn(
        "animate-pulse rounded-md bg-foreground/10",
        className,
      )}
    />
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "score" | "muted";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-foreground/10 text-foreground",
    muted: "bg-muted text-muted-foreground",
    score: "bg-yellow-400/15 text-yellow-300",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

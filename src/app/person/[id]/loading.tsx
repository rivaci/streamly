import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PersonLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="relative bg-black/50" style={{ minHeight: "50vh" }}>
        <Container className="flex min-h-[50vh] items-end gap-8 pb-10 md:pb-14">
          <Skeleton className="hidden h-72 w-48 shrink-0 rounded-xl sm:block" />
          <div className="flex-1">
            <Skeleton className="h-10 w-64 md:h-12 md:w-80" />
            <div className="mt-4 flex gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="mt-4 h-20 w-full max-w-xl" />
          </div>
        </Container>
      </div>

      {/* Filmography skeleton */}
      <Container className="py-10">
        <Skeleton className="mb-4 h-7 w-40" />
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="aspect-poster w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-1 h-3 w-1/2" />
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}

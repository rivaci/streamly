import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TitleLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <div className="relative bg-black" style={{ minHeight: "70vh" }}>
        <Skeleton className="absolute inset-0 rounded-none" />
        <Container className="relative flex min-h-[70vh] items-end pb-10 md:pb-14">
          <div className="max-w-2xl">
            <Skeleton className="h-10 w-80 md:h-14 md:w-[500px]" />
            <Skeleton className="mt-3 h-5 w-48" />
            <div className="mt-3 flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="mt-4 h-16 w-full max-w-xl" />
            <div className="mt-6 flex gap-3">
              <Skeleton className="h-12 w-32 rounded-lg" />
              <Skeleton className="h-12 w-40 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
          </div>
        </Container>
      </div>

      {/* Content skeleton */}
      <Container className="py-10">
        <div className="space-y-10">
          {/* Cast */}
          <section>
            <Skeleton className="mb-4 h-7 w-32" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="shrink-0">
                  <Skeleton className="h-24 w-24 rounded-full" />
                  <Skeleton className="mx-auto mt-2 h-3 w-16" />
                </div>
              ))}
            </div>
          </section>

          {/* Similar */}
          <section>
            <Skeleton className="mb-4 h-7 w-40" />
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <li key={i}>
                  <Skeleton className="aspect-poster w-full" />
                  <Skeleton className="mt-2 h-4 w-3/4" />
                </li>
              ))}
            </ul>
          </section>
        </div>
      </Container>
    </>
  );
}

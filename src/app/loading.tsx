import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <Container className="py-8">
      <Skeleton className="h-9 w-64" />
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="aspect-poster w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </li>
        ))}
      </ul>
    </Container>
  );
}

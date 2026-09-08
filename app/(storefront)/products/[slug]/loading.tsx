import { Skeleton } from "@/components/ui/Skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-2">
      <Skeleton className="aspect-[3/4] w-full" />

      <div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-3 h-9 w-3/4" />
        <Skeleton className="mt-2 h-4 w-24" />
        <Skeleton className="mt-3 h-6 w-28" />

        <div className="mt-8 space-y-4">
          <Skeleton className="h-4 w-16" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-12" />
            ))}
          </div>
          <Skeleton className="h-12 w-full" />
        </div>

        <div className="mt-10 space-y-3 border-t border-border pt-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-11 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

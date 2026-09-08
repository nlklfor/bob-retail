import { Skeleton } from "@/components/ui/Skeleton";

export default function HomeContentLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-80" />
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-border p-4">
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="mt-3 h-40 w-full" />
            <Skeleton className="mt-2 h-8 w-40" />
            <Skeleton className="mt-3 h-10 w-full" />
            <Skeleton className="mt-3 h-10 w-full" />
            <Skeleton className="mt-3 h-10 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

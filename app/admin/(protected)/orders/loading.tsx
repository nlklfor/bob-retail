import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminOrdersLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />

      <div className="mt-6 divide-y divide-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-4">
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3.5 w-32" />
            </div>
            <div className="flex flex-none items-center gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

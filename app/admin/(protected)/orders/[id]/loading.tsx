import { Skeleton } from "@/components/ui/Skeleton";

export default function AdminOrderDetailLoading() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-48" />
      </div>

      <div className="mt-6 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between py-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-1">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

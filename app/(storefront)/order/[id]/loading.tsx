import { Skeleton } from "@/components/ui/Skeleton";

export default function OrderConfirmationLoading() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex flex-col items-center text-center">
        <Skeleton className="h-20 w-20" />
        <Skeleton className="mt-6 h-8 w-64" />
        <Skeleton className="mt-3 h-4 w-40" />
      </div>

      <div className="mt-10 space-y-3 border-t border-border pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between py-1">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>

      <div className="mt-8 space-y-2">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="mt-10 flex justify-center">
        <Skeleton className="h-12 w-48" />
      </div>
    </div>
  );
}

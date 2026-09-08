import { Skeleton } from "@/components/ui/Skeleton";

// Shared between the new-product and edit-product loading states — both
// render the same ProductForm shape, just with different data underneath.
export function ProductFormSkeleton() {
  return (
    <div className="mt-6 max-w-2xl space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i}>
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
      ))}
      <div>
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="mt-2 h-24 w-20" />
      </div>
      <Skeleton className="h-11 w-32" />
    </div>
  );
}

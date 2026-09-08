import { Skeleton } from "@/components/ui/Skeleton";
import { ProductFormSkeleton } from "@/components/admin/ProductFormSkeleton";

export default function NewProductLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-40" />
      <ProductFormSkeleton />
    </div>
  );
}

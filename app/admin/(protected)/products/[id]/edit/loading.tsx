import { Skeleton } from "@/components/ui/Skeleton";
import { ProductFormSkeleton } from "@/components/admin/ProductFormSkeleton";

export default function EditProductLoading() {
  return (
    <div>
      <Skeleton className="h-8 w-48" />
      <ProductFormSkeleton />
    </div>
  );
}

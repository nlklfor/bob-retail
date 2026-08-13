import { requireStaffSession } from "@/lib/admin/dal";
import { getCategories } from "@/lib/products";
import { createProductAction } from "@/lib/actions/admin-products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireStaffSession();
  const categories = await getCategories();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-tight">
        New product
      </h1>
      <div className="mt-6">
        <ProductForm categories={categories} action={createProductAction} />
      </div>
    </div>
  );
}

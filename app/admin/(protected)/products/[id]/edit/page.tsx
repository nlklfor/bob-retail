import { notFound } from "next/navigation";
import { requireStaffSession } from "@/lib/admin/dal";
import { getProductForAdmin } from "@/lib/admin/products";
import { getCategories } from "@/lib/products";
import { updateProductAction } from "@/lib/actions/admin-products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaffSession();
  const { id } = await params;

  const [product, categories] = await Promise.all([
    getProductForAdmin(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-tight">
        Edit product
      </h1>
      <div className="mt-6">
        <ProductForm
          categories={categories}
          product={product}
          action={updateProductAction.bind(null, id)}
        />
      </div>
    </div>
  );
}

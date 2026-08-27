import { requireStaffSession } from "@/lib/admin/dal";
import { getCategoriesForAdmin } from "@/lib/admin/categories";
import { CategoryImagesForm } from "@/components/admin/CategoryImagesForm";

export default async function CategoriesPage() {
  await requireStaffSession();
  const categories = await getCategoriesForAdmin();

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-tight">
        Категорії
      </h1>
      <p className="mt-2 text-sm text-muted">
        Зображення для карток категорій на головній сторінці.
      </p>
      <div className="mt-6">
        <CategoryImagesForm categories={categories} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { requireStaffSession } from "@/lib/admin/dal";
import { getAllProductsForAdmin } from "@/lib/admin/products";
import { getCategories } from "@/lib/products";
import { deleteProductAction } from "@/lib/actions/admin-products";
import { formatPrice } from "@/lib/format";
import { AdminFlashToast } from "@/components/admin/AdminFlashToast";
import { Pagination } from "@/components/ui/Pagination";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireStaffSession();
  const { page } = await searchParams;

  const [products, categories] = await Promise.all([
    getAllProductsForAdmin(),
    getCategories(),
  ]);
  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, Number(page) || 1), totalPages);
  const pagedProducts = products.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return (
    <div>
      <AdminFlashToast param="created" message="Товар додано" />
      <AdminFlashToast param="updated" message="Товар збережено" />
      <AdminFlashToast param="deleted" message="Товар видалено" />
      <AdminFlashToast
        param="deleteError"
        message="Не вдалося видалити товар"
      />

      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl uppercase tracking-tight">
          Товари
        </h1>
        <Link
          href="/admin/products/new"
          className="border border-fg px-4 py-2 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
        >
          Новий товар
        </Link>
      </div>

      <div className="mt-6 divide-y divide-border">
        {pagedProducts.map((product) => {
          const totalStock = product.product_variants.reduce(
            (sum, v) => sum + v.stock_quantity,
            0,
          );
          return (
            <div
              key={product.id}
              className="flex items-center justify-between py-4"
            >
              <div>
                <p className="uppercase tracking-wide text-sm">
                  {product.name}{" "}
                  {!product.is_active && (
                    <span className="text-pending">(чернетка)</span>
                  )}
                </p>
                <p className="text-sm text-muted">
                  {product.category_id
                    ? categoryNameById.get(product.category_id)
                    : "—"}{" "}
                  · {formatPrice(product.price)} грн · {totalStock} на складі
                </p>
              </div>
              <div className="flex gap-4 text-sm">
                <Link
                  href={`/admin/products/${product.id}/edit`}
                  className="hover:text-accent"
                >
                  Редагувати
                </Link>
                <form action={deleteProductAction.bind(null, product.id)}>
                  <button
                    type="submit"
                    className="text-muted hover:text-danger"
                  >
                    Видалити
                  </button>
                </form>
              </div>
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="py-4 text-muted">Поки немає товарів.</p>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        buildHref={(p) => `/admin/products${p > 1 ? `?page=${p}` : ""}`}
      />
    </div>
  );
}

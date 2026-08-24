import { requireStaffSession } from "@/lib/admin/dal";
import { getHomeFeatureImagesForAdmin } from "@/lib/admin/home-content";
import { getAllProductsForAdmin } from "@/lib/admin/products";
import { HomeFeatureImagesForm } from "@/components/admin/HomeFeatureImagesForm";

export default async function HomeContentPage() {
  await requireStaffSession();

  const [slots, products] = await Promise.all([
    getHomeFeatureImagesForAdmin(),
    getAllProductsForAdmin(),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl uppercase tracking-tight">
        Зображення на головній
      </h1>
      <p className="mt-2 text-sm text-muted">
        Три банери на головній сторінці, між &quot;Новинками&quot; та
        категоріями.
      </p>
      <div className="mt-6">
        <HomeFeatureImagesForm slots={slots} products={products} />
      </div>
    </div>
  );
}

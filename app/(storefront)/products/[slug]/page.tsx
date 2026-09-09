import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getActiveProducts,
  getCategories,
  getProductBySlug,
} from "@/lib/products";
import { AddToCartForm } from "@/components/product/AddToCartForm";
import { PriceOfferForm } from "@/components/product/PriceOfferForm";
import { Accordion } from "@/components/product/Accordion";
import { Carousel } from "@/components/home/Carousel";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Товар не знайдено" };
  }

  const description =
    product.description?.trim() ||
    `${product.name} — оригінальний товар BOB Retail.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images.length > 0 ? product.images : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, categories, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
    getActiveProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const categoryName = product.category_id
    ? (categories.find((c) => c.id === product.category_id)?.name ?? null)
    : null;
  const otherProducts = allProducts.filter((p) => p.id !== product.id);

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-2">
        <div>
          {product.images.length > 0 ? (
            <Carousel>
              {product.images.map((src) => (
                <div
                  key={src}
                  className="relative aspect-[3/4] min-w-0 flex-[0_0_100%] bg-surface"
                >
                  <Image
                    src={src}
                    alt={product.name}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="aspect-[3/4] bg-surface" />
          )}
        </div>

        <div>
          {categoryName ? (
            <p className="text-sm uppercase tracking-wide text-muted">
              {categoryName}
            </p>
          ) : null}
          <h1 className="mt-1 font-display text-3xl uppercase tracking-tight">
            {product.name}
          </h1>
          {product.sku ? (
            <p className="mt-1 text-sm text-muted">{product.sku}</p>
          ) : null}
          <p className="text-accent text-lg mt-3">
            {formatPrice(product.price)} грн
          </p>

          <div className="mt-8 space-y-3">
            <AddToCartForm product={product} />
            <PriceOfferForm product={product} />
          </div>

          <Accordion
            items={[
              {
                title: "Чому нам довіряють",
                content: (
                  <ul className="list-disc space-y-1 pl-4">
                    <li>100% оригінальний товар</li>
                    <li>Захищена онлайн-оплата</li>
                    <li>
                      Товар в наявності — відправка протягом 1-2 днів. Під
                      замовлення (немає в наявності) — доставка 10-14 днів.
                    </li>
                  </ul>
                ),
              },
              {
                title: "Опис товару",
                content: (
                  <div className="space-y-4">
                    {product.description ? <p>{product.description}</p> : null}
                    {categoryName || product.sku ? (
                      <div>
                        <p className="text-fg">Характеристики:</p>
                        <ul className="mt-2 list-disc space-y-1 pl-4">
                          {categoryName ? (
                            <li>Категорія: {categoryName}</li>
                          ) : null}
                          {product.sku ? <li>Артикул: {product.sku}</li> : null}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                ),
              },
              {
                title: "Доставка та повернення",
                content: (
                  <ul className="list-disc space-y-1 pl-4">
                    <li>Товар в наявності — відправка протягом 1-2 днів</li>
                    <li>
                      Під замовлення (немає в наявності) — доставка 10-14 днів
                    </li>
                    <li>
                      <Link
                        href="/returns"
                        className="text-highlight hover:underline"
                      >
                        Умови повернення та обміну
                      </Link>
                    </li>
                  </ul>
                ),
              },
            ]}
          />
        </div>
      </div>

      {otherProducts.length > 0 ? (
        <NewArrivalsSection products={otherProducts} heading="Ще товари" />
      ) : null}
    </>
  );
}

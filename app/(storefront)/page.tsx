import Image from "next/image";
import {
  getActiveProducts,
  getCategories,
  getHomeFeatureImages,
} from "@/lib/products";
import { IntroSplash } from "@/components/home/IntroSplash";
import { ScrollIndicator } from "@/components/home/ScrollIndicator";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { FeatureImages } from "@/components/home/FeatureImages";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";

export default async function Home() {
  const [products, categories, featureImages] = await Promise.all([
    getActiveProducts(),
    getCategories(),
    getHomeFeatureImages(),
  ]);

  return (
    <>
      <IntroSplash />

      {/* Full-screen hero on larger screens (fills the rest of the viewport
          below the sticky header — 96px must match Header.tsx's
          HEADER_HEIGHT). On phones that container is tall and narrow, and
          the source image is a wide 16:9 landscape shot — object-cover was
          cropping it down to a thin center sliver, cutting off the logo
          marks in every corner. Matching the container to the image's own
          aspect ratio below sm: shows the whole image instead. */}
      <section className="relative aspect-[16/9] w-full bg-surface sm:aspect-auto sm:h-[calc(100vh-96px)]">
        <Image
          src="/images/bob_hero.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Legibility gradient so the scroll indicator stays readable
            regardless of what's in the image at the bottom edge. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />
        <ScrollIndicator targetId="catalog-preview" />
      </section>

      <div id="catalog-preview">
        <NewArrivalsSection products={products} />
      </div>

      <FeatureImages images={featureImages} />

      <CategoryShowcase categories={categories} />
    </>
  );
}

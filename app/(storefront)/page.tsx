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

      {/* Full-screen hero, full-bleed under the header — fills the rest of
          the viewport below the sticky header exactly, so the background
          gets the whole screen rather than a cropped strip. 96px here must
          match Header.tsx's HEADER_HEIGHT (h-24) — the header is a fixed
          height now specifically so this number stays correct across
          breakpoints instead of needing to be re-measured. */}
      <section className="relative h-[calc(100vh-96px)] w-full bg-surface">
        <Image
          src="/images/frombobwithlove.png"
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

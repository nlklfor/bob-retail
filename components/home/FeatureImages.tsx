import Image from "next/image";
import Link from "next/link";
import type { FeatureImageSlot } from "@/lib/products";

export function FeatureImages({ images }: { images: FeatureImageSlot[] }) {
  return (
    <section className="flex h-screen w-full border-t border-border">
      {images.map((slot) => {
        const media = slot.imageUrl ? (
          <Image
            src={slot.imageUrl}
            alt={slot.label ?? ""}
            fill
            sizes="(min-width: 640px) 34vw, 100vw"
            className="object-cover"
          />
        ) : null;

        const captionLabel = slot.label ? (
          <span className="absolute bottom-4 left-4 text-sm uppercase tracking-wide text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            {slot.label}
          </span>
        ) : null;

        // No product assigned yet in the admin panel — stays inert (not a
        // dead/broken link) with a quiet hover hint instead of pretending
        // to be clickable.
        const noLinkHint = !slot.productSlug ? (
          <span className="absolute right-2 top-2 bg-black/40 px-2 py-1 text-[10px] uppercase tracking-wide text-white/70 opacity-0 transition-opacity group-hover:opacity-100">
            Без посилання
          </span>
        ) : null;

        return (
          <div
            key={slot.position}
            className="relative flex-1 border-l border-border bg-surface first:border-l-0"
          >
            {slot.productSlug ? (
              <Link
                href={`/products/${slot.productSlug}`}
                className="group relative block h-full w-full"
              >
                {media}
                {captionLabel}
              </Link>
            ) : (
              <div className="group relative block h-full w-full">
                {media}
                {captionLabel}
                {noLinkHint}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

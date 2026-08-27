import Image from "next/image";
import Link from "next/link";
import { Carousel } from "./Carousel";
import type { Category } from "@/lib/types";

export function CategoryShowcase({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h2 className="text-center font-display text-3xl uppercase tracking-tight">
        Категорії
      </h2>

      <div className="mt-8">
        <Carousel>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/catalog?category=${category.slug}`}
              className="group relative flex aspect-[4/5] min-w-0 flex-[0_0_75%] overflow-hidden border border-border bg-surface sm:flex-[0_0_45%] lg:flex-[0_0_30%]"
            >
              {category.image_url ? (
                <>
                  <Image
                    src={category.image_url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 75vw"
                    className="object-cover transition-opacity group-hover:opacity-80"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="relative mt-auto p-4">
                    <span className="font-display text-2xl uppercase tracking-tight text-white">
                      {category.name}
                    </span>
                    <span className="mt-1 block text-xs uppercase tracking-[0.2em] text-white/80">
                      Переглянути
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center">
                  <span className="font-display text-2xl uppercase tracking-tight group-hover:text-highlight">
                    {category.name}
                  </span>
                  <span className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                    Переглянути
                  </span>
                </div>
              )}
            </Link>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

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
              className="group flex aspect-[4/5] min-w-0 flex-[0_0_75%] flex-col items-center justify-center border border-border bg-surface sm:flex-[0_0_45%] lg:flex-[0_0_30%]"
            >
              <span className="font-display text-2xl uppercase tracking-tight group-hover:text-highlight">
                {category.name}
              </span>
              <span className="mt-2 text-xs uppercase tracking-[0.2em] text-muted">
                Переглянути
              </span>
            </Link>
          ))}
        </Carousel>
      </div>
    </div>
  );
}

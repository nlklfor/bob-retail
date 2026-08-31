import type { Metadata } from "next";
import { ModelViewer } from "@/components/about/ModelViewer";

export const metadata: Metadata = {
  title: "Про нас",
  description: "Історія та цінності BOB Retail.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center font-display text-4xl uppercase tracking-tight sm:text-5xl">
        Про нас
      </h1>

      <div className="mx-auto mt-10 max-w-sm">
        <ModelViewer src="/from_bob_with_love.glb" />
      </div>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Наша історія
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            [ТУТ БУДЕ ІСТОРІЯ BOB RETAIL — коли і чому з&apos;явився бренд, що
            надихнуло на його створення. Замінити цей текст на реальний.]
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Що ми робимо
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            [ТУТ БУДЕ ОПИС того, що продає BOB Retail і чим це відрізняється від
            інших — оригінальний стрітвір, окремі колаборації, підхід до відбору
            товару тощо. Замінити цей текст на реальний.]
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Наші цінності
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 leading-relaxed text-muted">
            <li>[Цінність 1 — наприклад, гарантія оригінальності товару]</li>
            <li>[Цінність 2 — наприклад, чесність у комунікації з клієнтом]</li>
            <li>[Цінність 3 — наприклад, швидка доставка по Україні]</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

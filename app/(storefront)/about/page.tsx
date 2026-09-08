import type { Metadata } from "next";
import { ModelViewer } from "@/components/about/ModelViewer";

export const metadata: Metadata = {
  title: "Про Боба",
  description: "Історія та цінності BOB Retail.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center font-display text-4xl uppercase tracking-tight sm:text-5xl">
        Про Боба
      </h1>
      <p className="mt-3 text-center text-sm uppercase tracking-wide text-highlight">
        Only legit items &amp; cheaper prices
      </p>

      <div className="mx-auto mt-10 max-w-sm">
        <ModelViewer src="/from_bob_with_love.glb" />
      </div>

      <div className="mt-10 space-y-10">
        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Наша історія
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Bob з&apos;явився у 2022 році з простої ідеї: привозити оригінальні
            речі з Європи та США за найвигіднішою ціною — без переплат
            посередникам і без ризику нарватись на підробку. Те, що починалося
            як допомога знайомим у пошуку рідкісних речей, виросло у повноцінний
            сервіс, яким сьогодні користуються сотні людей по всій Україні.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Що ми робимо
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Одяг, взуття, аксесуари, колекційні речі — все, що ви забажаєте. Bob
            знаходить та привозить це особисто, і для цього потрібні лише фото
            та опис бажаної речі. Працюємо в чотирьох форматах: роздріб,
            байєр-сервіс (пошук і викуп конкретної речі під замовлення), опт та
            дропшипінг.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Опт та дропшипінг
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Для співпраці по опту та дропшипінгу — наш{" "}
            <a
              href="https://t.me/frombobwithlove"
              target="_blank"
              rel="noopener noreferrer"
              className="text-highlight hover:underline"
            >
              Telegram-канал
            </a>
            . Серед партнерів — 1755 | MANTO Original, оптова та дропшип
            співпраця з провідними спортсменами:{" "}
            <a
              href="https://www.instagram.com/_1755prod?stkn=MTlnOHh1dGdyNzI1cA=="
              target="_blank"
              rel="noopener noreferrer"
              className="text-highlight hover:underline"
            >
              @_1755prod
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Наші цінності
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 leading-relaxed text-muted">
            <li>100% оригінальна продукція — іншого варіанту в Bob не існує</li>
            <li>
              Вигідні ціни за рахунок прямих закупівель, без зайвих посередників
            </li>
            <li>
              Особистий підхід до кожного замовлення — від пошуку до отримання
            </li>
          </ul>
        </section>
      </div>

      <p className="mt-16 text-center text-sm uppercase tracking-wide text-muted">
        @bobretailer · Since 2022 · frombobwithlove
      </p>
    </div>
  );
}

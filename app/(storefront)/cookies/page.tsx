import type { Metadata } from "next";
import { DraftLegalNotice } from "@/components/legal/DraftLegalNotice";

export const metadata: Metadata = {
  title: "Файли cookie",
  description: "Що зберігає сайт BOB Retail у вашому браузері.",
  robots: { index: false, follow: false },
};

export default function CookiesPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center font-display text-4xl uppercase tracking-tight sm:text-5xl">
        Файли cookie
      </h1>

      <div className="mt-10">
        <DraftLegalNotice />
      </div>

      <div className="space-y-10">
        <section>
          <p className="leading-relaxed text-muted">
            Цей сайт не використовує рекламні чи трекінгові cookie і не передає
            дані про перегляди стороннім сервісам аналітики. Все, що
            зберігається у вашому браузері, — суто технічне і потрібне лише для
            роботи самого сайту.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Що саме зберігається
          </h2>
          <ul className="mt-3 list-disc space-y-3 pl-4 leading-relaxed text-muted">
            <li>
              <span className="text-fg">Кошик</span> (localStorage) — зберігає
              товари у вашому кошику між візитами на сайт, щоб вони не зникали
              при закритті вкладки.
            </li>
            <li>
              <span className="text-fg">Показ вступного відео</span>{" "}
              (sessionStorage) — позначка, що ви вже бачили вступне відео на
              головній сторінці, щоб воно не програвалося повторно протягом
              одного сеансу.
            </li>
            <li>
              <span className="text-fg">Сесія входу для персоналу</span> —
              захищений cookie-файл, що використовується виключно для входу в
              адміністративну панель. Звичайним відвідувачам сайту він не
              встановлюється.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Як керувати цими даними
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Ви можете очистити локальне сховище браузера в будь-який момент
            через налаштування вашого браузера — це просто очистить кошик на
            цьому пристрої, без жодного впливу на ваші персональні дані чи
            замовлення.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Контакти
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Питання — на{" "}
            <a
              href="mailto:frombobwithlove.com@gmail.com"
              className="text-highlight hover:underline"
            >
              frombobwithlove.com@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

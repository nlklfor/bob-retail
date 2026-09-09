import type { Metadata } from "next";
import { DraftLegalNotice } from "@/components/legal/DraftLegalNotice";

export const metadata: Metadata = {
  title: "Політика конфіденційності",
  description: "Як BOB Retail обробляє персональні дані.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center font-display text-4xl uppercase tracking-tight sm:text-5xl">
        Політика конфіденційності
      </h1>

      <div className="mt-10">
        <DraftLegalNotice />
      </div>

      <div className="space-y-10">
        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            1. Загальні положення
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Ця політика описує, які персональні дані збирає BOB Retail ([ФОП —
            уточнити]), з якою метою, кому вони можуть передаватися та як
            захищаються, відповідно до Закону України «Про захист персональних
            даних».
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            2. Які дані ми збираємо
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 leading-relaxed text-muted">
            <li>
              <span className="text-fg">Оформлення замовлення</span> —
              ім&apos;я, прізвище, номер телефону, email (необов&apos;язково),
              місто та відділення Нової Пошти.
            </li>
            <li>
              <span className="text-fg">Форма «Під замовлення»</span> — фото та
              розмір бажаного товару, ваш Instagram, та за бажанням колір,
              матеріал, орієнтовна вартість і посилання.
            </li>
            <li>
              <span className="text-fg">Форма зворотного зв&apos;язку</span> —
              ім&apos;я, email, Telegram або Instagram (необов&apos;язково),
              текст повідомлення.
            </li>
            <li>
              <span className="text-fg">Розсилка</span> — email, за вашою
              власною згодою під час підписки.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            3. Мета обробки даних
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Дані використовуються виключно для оформлення й доставки замовлень,
            пошуку та привозу товарів під замовлення, обробки звернень та — за
            окремою згодою — розсилки новин магазину. Дані не використовуються
            для жодних інших цілей і не продаються третім особам.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            4. Кому передаються дані
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Для виконання замовлення частина даних передається виключно
            сервісам, необхідним для доставки й оплати:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 leading-relaxed text-muted">
            <li>Нова Пошта — для доставки замовлення</li>
            <li>Monobank — для обробки оплати карткою</li>
          </ul>
          <p className="mt-3 leading-relaxed text-muted">
            Ці сервіси обробляють дані відповідно до власних політик
            конфіденційності. Дані не передаються жодним іншим третім особам,
            окрім випадків, передбачених законодавством України.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            5. Де зберігаються дані
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Дані зберігаються на серверах хмарного провайдера Supabase
            (дата-центр у Європейському Союзі) з обмеженим доступом та захищеним
            з&apos;єднанням. Доступ до персональних даних клієнтів мають лише
            уповноважені співробітники BOB Retail.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            6. Ваші права
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Ви маєте право запросити перегляд, виправлення або видалення своїх
            персональних даних, а також відкликати згоду на розсилку в будь-який
            момент — напишіть нам на{" "}
            <a
              href="mailto:frombobwithlove.com@gmail.com"
              className="text-highlight hover:underline"
            >
              frombobwithlove.com@gmail.com
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            7. Файли cookie та локальне сховище
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Сайт використовує лише технічно необхідне збереження даних у
            браузері (кошик, вхід для персоналу) — без стороннього відстеження
            чи реклами. Детальніше — на сторінці{" "}
            <a href="/cookies" className="text-highlight hover:underline">
              «Файли cookie»
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            8. Зміни до політики
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Ця політика може оновлюватися. Актуальна версія завжди доступна на
            цій сторінці.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            9. Контакти
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Питання щодо обробки персональних даних — на{" "}
            <a
              href="mailto:frombobwithlove.com@gmail.com"
              className="text-highlight hover:underline"
            >
              frombobwithlove.com@gmail.com
            </a>{" "}
            або{" "}
            <a
              href="tel:+380962414422"
              className="text-highlight hover:underline"
            >
              096 241 44 22
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}

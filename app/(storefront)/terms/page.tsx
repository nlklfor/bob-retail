import type { Metadata } from "next";
import { DraftLegalNotice } from "@/components/legal/DraftLegalNotice";

export const metadata: Metadata = {
  title: "Публічна оферта",
  description: "Умови продажу товарів на сайті BOB Retail.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center font-display text-4xl uppercase tracking-tight sm:text-5xl">
        Публічна оферта
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
            Цей документ є публічною офертою (пропозицією) Продавця укласти
            договір купівлі-продажу товарів дистанційним способом на умовах,
            викладених нижче. Оформлення замовлення на сайті означає повне та
            безумовне прийняття цих умов Покупцем.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            2. Терміни
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 leading-relaxed text-muted">
            <li>
              <span className="text-fg">Продавець</span> — [ФОП, повна назва,
              реєстраційні дані — уточнити].
            </li>
            <li>
              <span className="text-fg">Покупець</span> — будь-яка дієздатна
              фізична особа, яка оформлює замовлення на сайті.
            </li>
            <li>
              <span className="text-fg">Сайт</span> — bobretail (цей
              інтернет-магазин).
            </li>
            <li>
              <span className="text-fg">Товар</span> — одяг, взуття, аксесуари
              та інші вироби, представлені на сайті.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            3. Предмет договору
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Продавець зобов&apos;язується передати у власність Покупця товар, а
            Покупець зобов&apos;язується прийняти товар і оплатити його на
            умовах цього договору.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            4. Оформлення замовлення
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Замовлення оформлюється на сайті без реєстрації облікового запису —
            покупець обирає товар і розмір, додає в кошик та вказує контактні
            дані й адресу доставки під час оформлення. Договір вважається
            укладеним з моменту підтвердження замовлення на сайті.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            5. Ціна та оплата
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Ціни на сайті вказані в гривнях і включають усі податки. Оплата
            здійснюється карткою через платіжну систему Monobank в момент
            оформлення замовлення. Продавець залишає за собою право змінювати
            ціни на товари, що ще не були замовлені.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            6. Доставка
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Доставка здійснюється службою Нова Пошта. Товари, наявні на складі в
            Україні, відправляються протягом 1-2 днів після оплати. Вартість
            доставки розраховується автоматично під час оформлення замовлення та
            оплачується Покупцем окремо, якщо інше не погоджено сторонами.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            7. Товари під замовлення
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Окремі товари Продавець купує або резервує індивідуально для
            конкретного Покупця за кордоном (байєр-сервіс). Строк доставки таких
            товарів становить орієнтовно 10-18 робочих днів і залежить від
            митного оформлення. Перед оплатою Продавець погоджує з Покупцем
            модель, розмір, колір та вартість товару.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            8. Повернення та обмін
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Умови повернення та обміну товару викладені окремо на сторінці{" "}
            <a href="/returns" className="text-highlight hover:underline">
              «Умови повернення та обміну»
            </a>
            , яка є невід&apos;ємною частиною цього договору.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            9. Права та обов&apos;язки сторін
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Продавець зобов&apos;язується передати Покупцю товар належної якості
            та в узгоджений строк. Покупець зобов&apos;язується надати
            достовірні контактні дані та своєчасно прийняти й оплатити
            замовлений товар.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            10. Відповідальність та форс-мажор
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Сторони несуть відповідальність за невиконання або неналежне
            виконання умов цього договору відповідно до чинного законодавства
            України. Жодна зі сторін не несе відповідальності за невиконання
            зобов&apos;язань, спричинене обставинами непереборної сили
            (форс-мажор).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            11. Вирішення спорів
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Усі спори вирішуються шляхом переговорів, а за недосягнення згоди —
            у порядку, встановленому чинним законодавством України.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            12. Реквізити продавця
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            [ФОП, ІПН/ЄДРПОУ, юридична адреса — уточнити]
            <br />
            Email:{" "}
            <a
              href="mailto:frombobwithlove.com@gmail.com"
              className="text-highlight hover:underline"
            >
              frombobwithlove.com@gmail.com
            </a>
            <br />
            Телефон:{" "}
            <a
              href="tel:+380962414422"
              className="text-highlight hover:underline"
            >
              096 241 44 22
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

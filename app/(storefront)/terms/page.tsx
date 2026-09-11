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
            Цей документ є офіційною пропозицією (публічною офертою) Продавця
            укласти договір купівлі-продажу товарів дистанційним способом —
            через інтернет-магазин BOB Retail (далі — «Сайт»). Моментом повного
            та безумовного прийняття цієї оферти (акцептом) вважається факт
            оплати Покупцем замовлення на умовах, у строки та за цінами,
            вказаними на Сайті.
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
              фізична особа, яка оформлює замовлення на Сайті.
            </li>
            <li>
              <span className="text-fg">Сайт</span> — bobretail (цей
              інтернет-магазин), засіб для реалізації товару шляхом здійснення
              електронної угоди відповідно до Закону України «Про електронну
              комерцію».
            </li>
            <li>
              <span className="text-fg">Товар</span> — одяг, взуття, аксесуари
              та інші вироби, представлені на Сайті.
            </li>
            <li>
              <span className="text-fg">Замовлення</span> — вибір Покупцем
              окремих товарів із зазначенням розміру та кількості під час
              оформлення на Сайті.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            3. Предмет договору
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Продавець зобов&apos;язується передати у власність Покупця товар, а
            Покупець зобов&apos;язується оплатити і прийняти товар на умовах
            цього договору.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            4. Оформлення замовлення
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Замовлення оформлюється на Сайті без реєстрації облікового запису —
            Покупець обирає товар і розмір, додає в кошик та вказує контактні
            дані й адресу доставки під час оформлення. Кожна позиція товару в
            наявності може бути замовлена в кількості, обмеженій реальним
            залишком на складі.
          </p>
          <p className="mt-3 leading-relaxed text-muted">
            Якщо на момент оплати обраний розмір товару вже розкуплено іншим
            покупцем, Сайт повідомляє про це до списання коштів і замовлення не
            підтверджується — оплата за недоступний товар не стягується.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            5. Оплата замовлення
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Ціни на Сайті вказані в гривнях. Оплата здійснюється карткою,
            онлайн, через платіжну систему Monobank у момент оформлення
            замовлення — це єдиний спосіб оплати на Сайті, готівкою чи при
            отриманні Сайт не розраховується. Якщо кошти не надійшли, замовлення
            не вважається підтвердженим і Продавець залишає за собою право його
            анулювати. Продавець залишає за собою право змінювати ціни на
            товари, що ще не були оплачені.
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
            оплачується Покупцем окремо, якщо інше не погоджено сторонами. Разом
            із замовленням Покупцю надаються документи згідно з законодавством
            України.
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
            , яка є невід&apos;ємною частиною цього договору, і базуються на
            Законі України «Про захист прав споживачів».
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            9. Права та обов&apos;язки сторін
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Продавець зобов&apos;язаний передати Покупцю товар належної якості
            та в узгоджений строк, і має право в односторонньому порядку
            відмовити в обслуговуванні в разі порушення Покупцем умов цього
            договору (зокрема надання недостовірних контактних даних).
          </p>
          <p className="mt-3 leading-relaxed text-muted">
            Покупець зобов&apos;язаний надати достовірні контактні дані та
            своєчасно прийняти замовлений товар, і має право вимагати від
            Продавця виконання умов цього договору.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            10. Відповідальність сторін
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Сторони несуть відповідальність за невиконання або неналежне
            виконання умов цього договору відповідно до чинного законодавства
            України. Продавець не несе відповідальності за:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-4 leading-relaxed text-muted">
            <li>
              незначну відмінність кольору товару від зображення на Сайті, що
              може бути викликана особливостями передачі кольору різними
              екранами;
            </li>
            <li>
              зміст і достовірність інформації, наданої Покупцем при оформленні
              замовлення;
            </li>
            <li>
              затримки, спричинені обставинами поза розумним контролем Продавця
              (робота Нової Пошти, митниці тощо).
            </li>
          </ul>
          <p className="mt-3 leading-relaxed text-muted">
            У разі настання обставин непереборної сили (форс-мажор) сторони
            звільняються від виконання умов цього договору на час дії таких
            обставин.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            11. Інші умови
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 leading-relaxed text-muted">
            <li>
              Продавець залишає за собою право в односторонньому порядку вносити
              зміни до цього договору за умови попередньої публікації нової
              редакції на Сайті.
            </li>
            <li>
              Фактичною датою укладення електронного договору є дата акцепту
              оферти відповідно до ст. 11 Закону України «Про електронну
              комерцію».
            </li>
            <li>
              Перегляд товарів і оформлення замовлення на Сайті є безкоштовними
              для Покупця.
            </li>
            <li>
              Оплачуючи замовлення, Покупець надає Продавцю згоду на збір,
              обробку та зберігання своїх персональних даних відповідно до
              Закону України «Про захист персональних даних» — детальніше на
              сторінці{" "}
              <a href="/privacy" className="text-highlight hover:underline">
                «Політика конфіденційності»
              </a>
              .
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            12. Вирішення спорів
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Усі спори вирішуються шляхом переговорів, а за недосягнення згоди —
            у порядку, встановленому чинним законодавством України.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            13. Термін дії договору
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Договір діє до моменту повного виконання сторонами своїх
            зобов&apos;язань. До фактичної доставки товару він може бути
            розірваний за взаємною згодою сторін шляхом повернення коштів, а
            також в односторонньому порядку — у разі невиконання однією зі
            сторін умов цього договору.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            14. Реквізити продавця
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

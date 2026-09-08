import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Умови повернення та обміну",
  description:
    "Умови повернення та обміну товарів у BOB Retail — для товарів з наявності та під замовлення.",
};

export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-center font-display text-4xl uppercase tracking-tight sm:text-5xl">
        Умови повернення та обміну
      </h1>
      <p className="mt-6 leading-relaxed text-muted">
        Ми продаємо лише оригінальні товари та хочемо, щоб покупка у Bob була
        максимально комфортною та безпечною. Перед оформленням замовлення Bob
        завжди готовий допомогти з розміром, моделлю, станом та іншими
        характеристиками товару.
      </p>

      <div className="mt-12 space-y-10">
        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Товари з наявності
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Товар, який є в наявності в Україні, можна повернути або обміняти
            відповідно до чинного законодавства України, якщо він не підійшов за
            розміром, кольором, фасоном тощо.
          </p>
          <p className="mt-4 text-fg">Для повернення товар має бути:</p>
          <ul className="mt-2 list-disc space-y-1 pl-4 leading-relaxed text-muted">
            <li>без слідів використання</li>
            <li>без пошкоджень</li>
            <li>зі збереженим товарним виглядом</li>
            <li>
              зі всіма оригінальними бірками, етикетками та комплектуючими
            </li>
            <li>у повній комплектації</li>
            <li>у оригінальному пакуванні, якщо воно є частиною товару</li>
          </ul>
          <p className="mt-4 leading-relaxed text-muted">
            Взуття необхідно приміряти лише в приміщенні на чистій поверхні.
            Після виходу на вулицю товар вважається таким, що був у
            використанні.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Перед відправленням товару ми рекомендуємо перевірити розмір та всі
            характеристики. Bob із задоволенням допоможе підібрати правильний
            розмір.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Товари під замовлення
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Товари під замовлення ми купуємо або резервуємо індивідуально для
            конкретного клієнта. Перед оформленням замовлення ми погоджуємо з
            клієнтом модель, розмір, колір, ціну та умови замовлення — саме тому
            перед оплатою рекомендуємо уважно перевірити всі параметри.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Якщо товар повністю відповідає погодженому замовленню, але після
            отримання клієнт просто змінив рішення, Bob не гарантує можливість
            повернення такого товару.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            У разі виробничого дефекту, невідповідності замовленій моделі,
            розміру чи кольору, або іншої помилки з нашого боку — Bob
            обов&apos;язково допоможе вирішити ситуацію.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Повернення коштів
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 leading-relaxed text-muted">
            <li>
              Після отримання та перевірки товару ми підтверджуємо можливість
              повернення.
            </li>
            <li>
              Кошти повертаються тим самим способом, яким була здійснена оплата,
              якщо інше не погоджено сторонами.
            </li>
            <li>
              Вартість доставки при поверненні через те, що товар не підійшов
              покупцеві, може покладатися на покупця.
            </li>
            <li>
              Якщо повернення відбувається через помилку Bob або підтверджений
              дефект товару, витрати, пов&apos;язані з поверненням, Bob бере на
              себе.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl uppercase tracking-tight">
            Важливо
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-4 leading-relaxed text-muted">
            <li>Перед відправленням кожен товар проходить перевірку.</li>
            <li>
              Для захисту Bob та магазину процес пакування замовлення може
              фіксуватися на фото чи відео.
            </li>
            <li>
              Після отримання рекомендуємо перевірити товар до початку
              використання та повідомити нам про будь-які питання або
              невідповідності.
            </li>
          </ul>
        </section>
      </div>

      <div className="mt-16 border-t border-border pt-10 text-center">
        <p className="font-display text-lg uppercase tracking-tight">
          Bob — only legit
        </p>
        <p className="mt-3 leading-relaxed text-muted">
          Bob завжди за чесний і комфортний шопінг. Оригінальні товари. Прозорі
          умови. Відповідальний сервіс.
        </p>
        <p className="mt-4 text-sm uppercase tracking-wide text-muted">
          @bobretailer · Since 2022
        </p>
      </div>
    </div>
  );
}

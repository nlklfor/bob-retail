// Shown at the top of every legal draft page. This is not decorative — it's
// the actual, honest status of these documents: real content based on how
// the site really works, but not reviewed by a lawyer yet, and must not be
// treated as final or legally binding until someone qualified confirms it.
export function DraftLegalNotice() {
  return (
    <div className="mb-10 border border-pending bg-pending/10 px-5 py-4 text-sm text-pending">
      <p className="font-display uppercase tracking-tight">
        Чернетка — потребує юридичної перевірки
      </p>
      <p className="mt-1 leading-relaxed">
        Цей текст складено на основі реальної роботи сайту, але він ще не
        перевірений юристом і не є остаточним. Не покладайтесь на нього як на
        завершений юридичний документ до підтвердження фахівцем.
      </p>
    </div>
  );
}

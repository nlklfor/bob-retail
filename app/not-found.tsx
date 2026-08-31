import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
          <p className="font-display text-7xl uppercase tracking-tight text-highlight sm:text-8xl">
            404
          </p>
          <h1 className="mt-4 font-display text-2xl uppercase tracking-tight">
            Сторінку не знайдено
          </h1>
          <p className="mt-2 max-w-sm text-sm text-muted">
            Можливо, посилання застаріло або адресу введено з помилкою.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/"
              className="border border-fg px-6 py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
            >
              На головну
            </Link>
            <Link
              href="/catalog"
              className="border border-border px-6 py-3 text-sm uppercase tracking-wide hover:border-fg"
            >
              До каталогу
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

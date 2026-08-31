"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center text-fg">
      <p className="font-display text-2xl uppercase tracking-tight">
        Щось пішло не так
      </p>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Сталася непередбачена помилка. Спробуйте ще раз або поверніться на
        головну.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="border border-fg px-6 py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
        >
          Спробувати ще раз
        </button>
        <Link
          href="/"
          className="border border-border px-6 py-3 text-sm uppercase tracking-wide hover:border-fg"
        >
          На головну
        </Link>
      </div>
    </div>
  );
}

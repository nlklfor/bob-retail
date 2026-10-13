import type { Metadata } from "next";
import { UnsubscribeForm } from "@/components/newsletter/UnsubscribeForm";

export const metadata: Metadata = {
  title: "Відписка від розсилки",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-6 py-16 text-center">
      <h1 className="font-display text-4xl uppercase tracking-tight">
        Розсилка
      </h1>
      {token ? (
        <UnsubscribeForm token={token} />
      ) : (
        <p className="mt-6 leading-relaxed text-muted">
          Посилання для відписки неповне. Скористайтеся посиланням з листа ще
          раз.
        </p>
      )}
    </div>
  );
}

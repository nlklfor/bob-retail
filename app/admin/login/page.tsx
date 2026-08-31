"use client";

import { useState } from "react";
import { signInAction } from "@/lib/actions/admin-auth";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await signInAction(new FormData(e.currentTarget));
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
      <h1 className="font-display text-2xl uppercase tracking-tight">
        Вхід для персоналу
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-3">
        <label htmlFor="admin-email" className="sr-only">
          Ел. пошта
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          placeholder="Ел. пошта"
          required
          className="w-full border border-border bg-transparent px-3 py-2"
        />
        <label htmlFor="admin-password" className="sr-only">
          Пароль
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          placeholder="Пароль"
          required
          className="w-full border border-border bg-transparent px-3 py-2"
        />
        {error ? <p className="text-danger text-sm">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-fg py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg disabled:opacity-30"
        >
          {submitting ? "Вхід..." : "Увійти"}
        </button>
      </form>
    </div>
  );
}

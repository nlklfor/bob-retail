"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToastStore } from "@/lib/toast-store";

// Shows a toast once, driven by a "?param=1" flag on the URL the admin
// action redirected to (create/update/delete all end in a redirect(), so
// there's no return value left to react to on the client — the flag is
// the signal instead).
export function AdminFlashToast({
  param,
  message,
}: {
  param: string;
  message: string;
}) {
  const searchParams = useSearchParams();
  const show = useToastStore((state) => state.show);
  const present = searchParams.has(param);

  useEffect(() => {
    if (!present) return;
    const handle = window.setTimeout(() => show(message), 0);
    return () => window.clearTimeout(handle);
  }, [present, message, show]);

  return null;
}

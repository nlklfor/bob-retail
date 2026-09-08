"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { CloseIcon } from "@/components/layout/icons";
import { useReducedMotionAware } from "@/lib/useReducedMotionAware";
import { useProductRequestStore } from "@/lib/product-request-store";
import {
  uploadProductRequestImageAction,
  submitProductRequestAction,
} from "@/lib/actions/product-requests";

const FIELD_CLASS =
  "w-full border-b border-border bg-transparent py-2 text-sm placeholder:text-muted focus:border-fg focus:outline-none";
const MAX_PHOTOS = 6;

export function RequestProductTab() {
  // Shared store, not local state — the header nav's "Під замовлення" entry
  // (small/tablet screens especially, per the client's own note that the
  // inline nav gets cramped there) opens this same panel, not just the
  // edge tab.
  const open = useProductRequestStore((state) => state.isOpen);
  const openPanel = useProductRequestStore((state) => state.open);
  const closePanel = useProductRequestStore((state) => state.close);
  const prefersReducedMotion = useReducedMotionAware();

  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function close() {
    closePanel();
  }

  function resetForm() {
    setPhotos([]);
    setUploadError(null);
    setError(null);
    setDone(false);
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    for (const file of Array.from(files)) {
      if (photos.length >= MAX_PHOTOS) break;
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadProductRequestImageAction(formData);
      if ("error" in result) {
        setUploadError(result.error);
        continue;
      }
      setPhotos((prev) => [...prev, result.url]);
    }
    setUploading(false);
  }

  function removePhoto(url: string) {
    setPhotos((prev) => prev.filter((p) => p !== url));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const expectedCostRaw = String(formData.get("expectedCost") ?? "").trim();

    const result = await submitProductRequestAction({
      name: String(formData.get("name") ?? ""),
      photos,
      size: String(formData.get("size") ?? ""),
      instagramHandle: String(formData.get("instagramHandle") ?? ""),
      color: String(formData.get("color") ?? ""),
      material: String(formData.get("material") ?? ""),
      expectedCost: expectedCostRaw ? Number(expectedCostRaw) : undefined,
      link: String(formData.get("link") ?? ""),
      description: String(formData.get("description") ?? ""),
    });

    if (!result.success) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setDone(true);
    setSubmitting(false);
  }

  return (
    <>
      {/* Desktop only — below lg: this same panel already has an entry
          point in the header nav (an inline button ≥lg:, a hamburger-menu
          item below that), so the edge tab was just redundant clutter
          overlapping real content on phones/tablets. */}
      <button
        type="button"
        onClick={() => openPanel()}
        className="fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 border border-l-0 border-fg bg-bg px-3 py-4 text-xs uppercase tracking-wide [writing-mode:vertical-rl] hover:bg-fg hover:text-bg lg:block"
      >
        Замовити товар, який бажаєте
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
              aria-hidden="true"
              className="fixed inset-0 z-[150] bg-fg/40"
            />
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { x: "-100%" }}
              animate={prefersReducedMotion ? { opacity: 1 } : { x: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              role="dialog"
              aria-label="Замовити товар"
              className="fixed inset-y-0 left-0 z-[151] flex w-full max-w-md flex-col overflow-y-auto bg-bg text-fg"
            >
              <div className="flex items-center justify-between border-b border-border px-6 py-5">
                <h2 className="font-display text-lg uppercase tracking-tight">
                  Замовити товар
                </h2>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Закрити"
                  className="hover:text-highlight"
                >
                  <CloseIcon />
                </button>
              </div>

              {done ? (
                <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                  <p className="font-display text-xl uppercase tracking-tight">
                    Дякуємо!
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    Ми зв&apos;яжемося з вами в Instagram, щойно знайдемо товар.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      setTimeout(resetForm, 300);
                    }}
                    className="mt-6 border border-fg px-6 py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg"
                  >
                    Закрити
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex-1 space-y-5 px-6 py-6"
                >
                  <div className="space-y-2 text-sm text-muted">
                    <p>
                      Bob особисто знайде та привезе потрібну річ з Європи чи
                      США — контролюємо весь процес до отримання вашої покупки,
                      вигідніше й безпечніше, ніж деінде.
                    </p>
                    <p>
                      Доставка: ~10–18 робочих днів (пн–пт), буває швидше, буває
                      довше — залежить від митниці. Можливі затримки на кордоні.
                    </p>
                  </div>

                  <div>
                    <label className="text-sm uppercase tracking-wide text-muted">
                      Фото <span className="text-highlight">*</span>
                    </label>
                    <div className="mt-2 flex flex-wrap gap-3">
                      {photos.map((url) => (
                        <div key={url} className="relative h-20 w-16">
                          <Image
                            src={url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(url)}
                            className="absolute -right-2 -top-2 border border-border bg-bg px-1 text-xs hover:text-danger"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      multiple
                      disabled={uploading || photos.length >= MAX_PHOTOS}
                      onChange={(e) => handleFilesSelected(e.target.files)}
                      className="mt-3 text-sm text-muted file:mr-3 file:cursor-pointer file:border file:border-fg file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wide file:text-fg hover:file:bg-fg hover:file:text-bg disabled:opacity-40"
                    />
                    {uploading ? (
                      <p className="mt-1 text-sm text-muted">Завантаження...</p>
                    ) : null}
                    {uploadError ? (
                      <p className="mt-1 text-sm text-danger">{uploadError}</p>
                    ) : null}
                  </div>

                  <div>
                    <label
                      htmlFor="request-size"
                      className="text-sm uppercase tracking-wide text-muted"
                    >
                      Розмір <span className="text-highlight">*</span>
                    </label>
                    <input
                      id="request-size"
                      name="size"
                      required
                      className={`mt-1 ${FIELD_CLASS}`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="request-instagram"
                      className="text-sm uppercase tracking-wide text-muted"
                    >
                      Instagram для зв&apos;язку{" "}
                      <span className="text-highlight">*</span>
                    </label>
                    <input
                      id="request-instagram"
                      name="instagramHandle"
                      required
                      placeholder="@username"
                      className={`mt-1 ${FIELD_CLASS}`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="request-name"
                      className="text-sm uppercase tracking-wide text-muted"
                    >
                      Назва товару
                    </label>
                    <input
                      id="request-name"
                      name="name"
                      className={`mt-1 ${FIELD_CLASS}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="request-color"
                        className="text-sm uppercase tracking-wide text-muted"
                      >
                        Колір
                      </label>
                      <input
                        id="request-color"
                        name="color"
                        className={`mt-1 ${FIELD_CLASS}`}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="request-material"
                        className="text-sm uppercase tracking-wide text-muted"
                      >
                        Матеріал
                      </label>
                      <input
                        id="request-material"
                        name="material"
                        className={`mt-1 ${FIELD_CLASS}`}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="request-cost"
                      className="text-sm uppercase tracking-wide text-muted"
                    >
                      Очікувана вартість (грн)
                    </label>
                    <input
                      id="request-cost"
                      name="expectedCost"
                      type="number"
                      min="0"
                      step="1"
                      className={`mt-1 ${FIELD_CLASS}`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="request-link"
                      className="text-sm uppercase tracking-wide text-muted"
                    >
                      Посилання на товар
                    </label>
                    <input
                      id="request-link"
                      name="link"
                      type="url"
                      placeholder="https://"
                      className={`mt-1 ${FIELD_CLASS}`}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="request-description"
                      className="text-sm uppercase tracking-wide text-muted"
                    >
                      Опис
                    </label>
                    <textarea
                      id="request-description"
                      name="description"
                      rows={3}
                      className={`mt-1 ${FIELD_CLASS} resize-none`}
                    />
                  </div>

                  {error ? (
                    <p className="text-sm text-danger">{error}</p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={submitting || uploading || photos.length === 0}
                    className="w-full bg-fg py-3 text-sm uppercase tracking-wide text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    {submitting ? "Надсилання..." : "Надіслати запит"}
                  </button>
                </form>
              )}
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

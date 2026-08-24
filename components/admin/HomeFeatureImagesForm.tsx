"use client";

import { useState } from "react";
import Image from "next/image";
import type { HomeFeatureImage, ProductWithVariants } from "@/lib/types";
import { uploadProductImageAction } from "@/lib/actions/admin-products";
import { updateHomeFeatureImageAction } from "@/lib/actions/admin-home-content";

function Slot({
  slot,
  products,
}: {
  slot: HomeFeatureImage;
  products: ProductWithVariants[];
}) {
  const [imageUrl, setImageUrl] = useState(slot.image_url ?? "");
  const [label, setLabel] = useState(slot.label ?? "");
  const [productId, setProductId] = useState(slot.product_id ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleFileSelected(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSaved(false);

    const formData = new FormData();
    formData.set("file", file);
    const result = await uploadProductImageAction(formData);
    if ("error" in result) {
      setError(result.error);
    } else {
      setImageUrl(result.url);
    }
    setUploading(false);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSaved(false);

    const formData = new FormData();
    formData.set("position", String(slot.position));
    formData.set("imageUrl", imageUrl);
    formData.set("label", label);
    formData.set("productId", productId);

    const result = await updateHomeFeatureImageAction(formData);
    if ("error" in result) {
      setError(result.error);
    } else {
      setSaved(true);
    }
    setSaving(false);
  }

  return (
    <div className="border border-border p-4">
      <p className="text-sm uppercase tracking-wide text-muted">
        Банер {slot.position}
      </p>

      <div className="relative mt-3 h-40 w-full bg-surface">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill className="object-cover" />
        ) : null}
      </div>
      <input
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={uploading}
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
        className="mt-2 text-sm"
      />
      {uploading ? (
        <p className="mt-1 text-sm text-muted">Завантаження...</p>
      ) : null}

      <div className="mt-3">
        <label className="text-sm uppercase tracking-wide text-muted">
          Підпис
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="mt-1 w-full border border-border bg-transparent px-3 py-2"
        />
      </div>

      <div className="mt-3">
        <label className="text-sm uppercase tracking-wide text-muted">
          Товар (посилання)
        </label>
        <select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="mt-1 w-full border border-border bg-transparent px-3 py-2"
        >
          <option value="">— без посилання —</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      {saved ? <p className="mt-2 text-sm text-muted">Збережено.</p> : null}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || uploading}
        className="mt-3 border border-fg px-4 py-2 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg disabled:opacity-30"
      >
        {saving ? "Збереження..." : "Зберегти"}
      </button>
    </div>
  );
}

export function HomeFeatureImagesForm({
  slots,
  products,
}: {
  slots: HomeFeatureImage[];
  products: ProductWithVariants[];
}) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {slots.map((slot) => (
        <Slot key={slot.id} slot={slot} products={products} />
      ))}
    </div>
  );
}

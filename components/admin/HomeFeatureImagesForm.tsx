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

  const fileInputId = `feature-image-${slot.id}`;
  const labelInputId = `feature-label-${slot.id}`;
  const productSelectId = `feature-product-${slot.id}`;

  return (
    <div className="border border-border p-4">
      <label
        htmlFor={fileInputId}
        className="text-sm uppercase tracking-wide text-muted"
      >
        Банер {slot.position}
      </label>

      <div className="relative mt-3 h-40 w-full bg-surface">
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill className="object-cover" />
        ) : null}
      </div>
      <input
        id={fileInputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={uploading}
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
        className="mt-2 text-sm text-muted file:mr-3 file:cursor-pointer file:border file:border-fg file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-wide file:text-fg hover:file:bg-fg hover:file:text-bg disabled:opacity-40"
      />
      {uploading ? (
        <p className="mt-1 text-sm text-muted">Завантаження...</p>
      ) : null}

      <div className="mt-3">
        <label
          htmlFor={labelInputId}
          className="text-sm uppercase tracking-wide text-muted"
        >
          Підпис
        </label>
        <input
          id={labelInputId}
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="mt-1 w-full border border-border bg-transparent px-3 py-2"
        />
      </div>

      <div className="mt-3">
        <label
          htmlFor={productSelectId}
          className="text-sm uppercase tracking-wide text-muted"
        >
          Товар (посилання)
        </label>
        <select
          id={productSelectId}
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
      {saved ? <p className="mt-2 text-sm text-success">Збережено.</p> : null}

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

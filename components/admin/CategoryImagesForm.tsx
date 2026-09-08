"use client";

import { useState } from "react";
import Image from "next/image";
import type { Category } from "@/lib/types";
import { uploadProductImageAction } from "@/lib/actions/admin-products";
import { updateCategoryImageAction } from "@/lib/actions/admin-categories";

function CategoryRow({ category }: { category: Category }) {
  const [imageUrl, setImageUrl] = useState(category.image_url ?? "");
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
    formData.set("id", category.id);
    formData.set("imageUrl", imageUrl);
    const result = await updateCategoryImageAction(formData);
    if ("error" in result) {
      setError(result.error);
    } else {
      setSaved(true);
    }
    setSaving(false);
  }

  const fileInputId = `category-image-${category.id}`;

  return (
    <div className="border border-border p-4">
      <label
        htmlFor={fileInputId}
        className="text-sm uppercase tracking-wide text-muted"
      >
        {category.name}
      </label>

      <div className="relative mt-3 aspect-[4/5] w-full bg-surface">
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

export function CategoryImagesForm({ categories }: { categories: Category[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-3">
      {categories.map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}
    </div>
  );
}

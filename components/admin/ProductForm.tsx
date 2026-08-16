"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import type { Category, ProductWithVariants } from "@/lib/types";
import { uploadProductImageAction } from "@/lib/actions/admin-products";

type VariantRow = { size: string; stockQuantity: number; weightGrams: number };

type Props = {
  categories: Category[];
  product?: ProductWithVariants;
  action: (formData: FormData) => Promise<{ error: string } | void>;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function ProductForm({ categories, product, action }: Props) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const slugTouched = useRef(Boolean(product)); // editing an existing product: don't auto-overwrite its slug

  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [variants, setVariants] = useState<VariantRow[]>(
    product?.product_variants.map((v) => ({
      size: v.size ?? "",
      stockQuantity: v.stock_quantity,
      weightGrams: v.weight_grams,
    })) ?? [{ size: "", stockQuantity: 0, weightGrams: 500 }],
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched.current) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    slugTouched.current = true;
    setSlug(value);
  }

  async function handleFilesSelected(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadProductImageAction(formData);
      if ("error" in result) {
        setUploadError(result.error);
        continue;
      }
      setImages((prev) => [...prev, result.url]);
    }

    setUploading(false);
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function updateVariant(
    index: number,
    field: keyof VariantRow,
    value: string,
  ) {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === index
          ? {
              ...v,
              [field]:
                field === "stockQuantity" || field === "weightGrams"
                  ? Number(value) || 0
                  : value,
            }
          : v,
      ),
    );
  }

  function addVariant() {
    setVariants((prev) => [
      ...prev,
      { size: "", stockQuantity: 0, weightGrams: 500 },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("imagesJson", JSON.stringify(images));
    formData.set(
      "variantsJson",
      JSON.stringify(
        variants
          .filter((v) => v.size.trim() !== "" || variants.length === 1)
          .map((v) => ({
            size: v.size.trim() || null,
            stockQuantity: v.stockQuantity,
            weightGrams: v.weightGrams,
          })),
      ),
    );

    const result = await action(formData);
    if (result?.error) {
      setError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="text-sm uppercase tracking-wide text-muted">
          Назва
        </label>
        <input
          name="name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          required
          className="mt-1 w-full border border-border bg-transparent px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm uppercase tracking-wide text-muted">
          Слаг (URL)
        </label>
        <input
          name="slug"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          required
          pattern="[a-z0-9-]+"
          className="mt-1 w-full border border-border bg-transparent px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm uppercase tracking-wide text-muted">
          Категорія
        </label>
        <select
          name="categoryId"
          defaultValue={product?.category_id ?? ""}
          className="mt-1 w-full border border-border bg-transparent px-3 py-2"
        >
          <option value="">—</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm uppercase tracking-wide text-muted">
          Опис
        </label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={4}
          className="mt-1 w-full border border-border bg-transparent px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm uppercase tracking-wide text-muted">
          Ціна (грн)
        </label>
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={product?.price}
          required
          className="mt-1 w-full border border-border bg-transparent px-3 py-2"
        />
      </div>

      <div>
        <label className="text-sm uppercase tracking-wide text-muted">
          Зображення
        </label>
        <div className="mt-2 flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={url} className="relative h-24 w-20">
              <Image src={url} alt="" fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -right-2 -top-2 bg-bg border border-border px-1 text-xs hover:text-danger"
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
          disabled={uploading}
          onChange={(e) => handleFilesSelected(e.target.files)}
          className="mt-3 text-sm"
        />
        {uploading ? (
          <p className="mt-1 text-sm text-muted">Завантаження...</p>
        ) : null}
        {uploadError ? (
          <p className="mt-1 text-danger text-sm">{uploadError}</p>
        ) : null}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm uppercase tracking-wide text-muted">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={product?.is_active ?? false}
          />
          Активний (видимий у магазині)
        </label>
      </div>

      <div>
        <label className="text-sm uppercase tracking-wide text-muted">
          Розміри, залишки та вага
        </label>
        <div className="mt-2 space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex gap-2">
              <input
                placeholder="Розмір (залиште порожнім, якщо немає)"
                value={v.size}
                onChange={(e) => updateVariant(i, "size", e.target.value)}
                className="flex-1 border border-border bg-transparent px-3 py-2"
              />
              <input
                type="number"
                min="0"
                placeholder="Залишок"
                value={v.stockQuantity}
                onChange={(e) =>
                  updateVariant(i, "stockQuantity", e.target.value)
                }
                className="w-28 border border-border bg-transparent px-3 py-2"
              />
              <input
                type="number"
                min="1"
                placeholder="Вага (г)"
                value={v.weightGrams}
                onChange={(e) =>
                  updateVariant(i, "weightGrams", e.target.value)
                }
                className="w-32 border border-border bg-transparent px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeVariant(i)}
                disabled={variants.length === 1}
                className="text-sm text-muted hover:text-danger disabled:opacity-30"
              >
                Видалити
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addVariant}
          className="mt-2 text-sm text-accent hover:underline"
        >
          + Додати розмір
        </button>
      </div>

      {error ? <p className="text-danger text-sm">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting || uploading}
        className="border border-fg px-4 py-2 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg disabled:opacity-30"
      >
        {submitting ? "Збереження..." : "Зберегти"}
      </button>
    </form>
  );
}

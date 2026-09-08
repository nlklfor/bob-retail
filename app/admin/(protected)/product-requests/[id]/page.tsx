import { notFound } from "next/navigation";
import Image from "next/image";
import { requireStaffSession } from "@/lib/admin/dal";
import { getProductRequestForAdmin } from "@/lib/admin/product-requests";
import { ProductRequestStatusSelect } from "@/components/admin/ProductRequestStatusSelect";
import { DeleteProductRequestButton } from "@/components/admin/DeleteProductRequestButton";
import { formatPrice } from "@/lib/format";
import type { ProductRequestStatus } from "@/lib/product-request-status-labels";

export default async function AdminProductRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaffSession();
  const { id } = await params;
  const request = await getProductRequestForAdmin(id);

  if (!request) {
    notFound();
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl uppercase tracking-tight">
          {request.name || "Запит на товар"}
        </h1>
        <div className="flex items-center gap-4">
          <ProductRequestStatusSelect
            requestId={request.id}
            status={request.status as ProductRequestStatus}
          />
          <DeleteProductRequestButton requestId={request.id} />
        </div>
      </div>
      <p className="mt-1 text-sm text-muted">
        {new Date(request.created_at).toLocaleString()}
      </p>

      {request.photos.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {request.photos.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-32 w-24 bg-surface"
            >
              <Image src={url} alt="" fill className="object-cover" />
            </a>
          ))}
        </div>
      ) : null}

      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between border-b border-border pb-2">
          <dt className="text-muted">Розмір</dt>
          <dd>{request.size}</dd>
        </div>
        <div className="flex justify-between border-b border-border pb-2">
          <dt className="text-muted">Instagram</dt>
          <dd>{request.instagram_handle}</dd>
        </div>
        {request.color ? (
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted">Колір</dt>
            <dd>{request.color}</dd>
          </div>
        ) : null}
        {request.material ? (
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted">Матеріал</dt>
            <dd>{request.material}</dd>
          </div>
        ) : null}
        {request.expected_cost ? (
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted">Очікувана вартість</dt>
            <dd>{formatPrice(request.expected_cost)} грн</dd>
          </div>
        ) : null}
        {request.link ? (
          <div className="flex justify-between border-b border-border pb-2">
            <dt className="text-muted">Посилання</dt>
            <dd className="truncate">
              <a
                href={request.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-highlight hover:underline"
              >
                {request.link}
              </a>
            </dd>
          </div>
        ) : null}
      </dl>

      {request.description ? (
        <div className="mt-6">
          <p className="text-sm uppercase tracking-wide text-muted">Опис</p>
          <p className="mt-2 whitespace-pre-wrap text-sm">
            {request.description}
          </p>
        </div>
      ) : null}
    </div>
  );
}

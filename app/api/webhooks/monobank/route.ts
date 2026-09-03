import {
  getPublicKey,
  type MonobankInvoiceStatus,
} from "@/lib/monobank/client";
import { verifyMonobankSignature } from "@/lib/monobank/verify-webhook";
import { applyInvoiceStatus } from "@/lib/monobank/apply-status";

// node:crypto (used for signature verification) needs the Node runtime, not Edge.
export const runtime = "nodejs";

type MonobankWebhookPayload = {
  invoiceId: string;
  status: MonobankInvoiceStatus;
  reference?: string;
};

export async function POST(request: Request): Promise<Response> {
  const rawBody = await request.text();
  const signature = request.headers.get("x-sign");

  if (!signature) {
    return new Response("Missing X-Sign header", { status: 400 });
  }

  let publicKey: string;
  try {
    publicKey = await getPublicKey();
  } catch (err) {
    console.error("Monobank webhook: failed to fetch public key", err);
    // A 5xx tells Monobank to retry — this is our own transient failure to
    // fetch the key, not evidence the webhook itself is invalid.
    return new Response("Could not verify signature", { status: 502 });
  }

  if (!verifyMonobankSignature(rawBody, signature, publicKey)) {
    console.error("Monobank webhook: signature verification failed");
    return new Response("Invalid signature", { status: 400 });
  }

  let payload: MonobankWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  // `reference` is the order id we set when creating the invoice
  // (merchantPaymInfo.reference) — Monobank echoes it back on every status
  // update, so there's no separate lookup needed.
  if (!payload.reference || !payload.invoiceId || !payload.status) {
    return new Response("Missing required fields", { status: 400 });
  }

  try {
    await applyInvoiceStatus(
      payload.reference,
      payload.invoiceId,
      payload.status,
    );
  } catch (err) {
    console.error("Monobank webhook: failed to apply invoice status", err);
    return new Response("Failed to process webhook", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

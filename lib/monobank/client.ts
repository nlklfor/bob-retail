import "server-only";

// Thin wrapper around Monobank's Acquiring API. Contract (fields, endpoints)
// verified against the official docs (monobank.ua/api-docs/acquiring) and
// Monobank's own reference implementations — same "verify against the real
// source, don't guess" rule as the Nova Poshta client.
const API_BASE = "https://api.monobank.ua";

function getApiKey(): string {
  const apiKey = process.env.MONOBANK_API_KEY;
  if (!apiKey) {
    throw new Error("MONOBANK_API_KEY is not configured.");
  }
  return apiKey;
}

async function callMonobank<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "X-Token": getApiKey(),
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Monobank API request to ${path} failed (${res.status}): ${body}`,
    );
  }

  return res.json() as Promise<T>;
}

export type MonobankBasketItem = {
  name: string;
  qty: number;
  sum: number; // kopecks, per unit
  unit?: string;
};

export type CreateInvoiceInput = {
  amount: number; // kopecks, total
  reference: string; // our order id
  destination: string; // shown to the customer on Monobank's payment page
  basketOrder?: MonobankBasketItem[];
  redirectUrl: string;
  webHookUrl: string;
  validitySeconds?: number;
};

export type CreateInvoiceResult = {
  invoiceId: string;
  pageUrl: string;
};

export async function createInvoice(
  input: CreateInvoiceInput,
): Promise<CreateInvoiceResult> {
  return callMonobank<CreateInvoiceResult>("/api/merchant/invoice/create", {
    method: "POST",
    body: JSON.stringify({
      amount: input.amount,
      ccy: 980, // UAH
      merchantPaymInfo: {
        reference: input.reference,
        destination: input.destination,
        basketOrder: input.basketOrder,
      },
      redirectUrl: input.redirectUrl,
      webHookUrl: input.webHookUrl,
      validity: input.validitySeconds ?? 3600,
      paymentType: "debit",
    }),
  });
}

// The exact set Monobank documents for an invoice's lifecycle. `hold` only
// applies to paymentType "hold", which we don't use, but it's included for
// completeness/type-safety against whatever the API actually returns.
export type MonobankInvoiceStatus =
  | "created"
  | "processing"
  | "hold"
  | "success"
  | "failure"
  | "reversed"
  | "expired";

export type InvoiceStatusResult = {
  invoiceId: string;
  status: MonobankInvoiceStatus;
  amount: number;
  ccy: number;
  reference?: string;
};

export async function getInvoiceStatus(
  invoiceId: string,
): Promise<InvoiceStatusResult> {
  return callMonobank<InvoiceStatusResult>(
    `/api/merchant/invoice/status?invoiceId=${encodeURIComponent(invoiceId)}`,
  );
}

// The public key used to verify webhook signatures (see verify-webhook.ts).
// It doesn't rotate in normal operation, so it's cached in memory for the
// life of the server process — same pattern as the Nova Poshta sender-city
// ref cache.
let cachedPublicKeyPem: string | null = null;

export async function getPublicKey(): Promise<string> {
  if (cachedPublicKeyPem) return cachedPublicKeyPem;

  const { key } = await callMonobank<{ key: string }>("/api/merchant/pubkey");
  cachedPublicKeyPem = Buffer.from(key, "base64").toString("utf-8");
  return cachedPublicKeyPem;
}

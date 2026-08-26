"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { placeOrderAction } from "@/lib/actions/checkout";
import { CloseIcon } from "@/components/layout/icons";
import {
  searchCitiesAction,
  searchWarehousesAction,
  previewShippingCostAction,
} from "@/lib/actions/nova-poshta";
import type {
  NovaPoshtaCity,
  NovaPoshtaWarehouse,
} from "@/lib/nova-poshta/client";

const DEBOUNCE_MS = 350;

// Underline-only fields (no boxed border) — matches the reference layout's
// minimal input style; placeholder doubles as the label, same as before.
const FIELD_CLASS =
  "w-full border-0 border-b border-border bg-transparent px-0 py-2 placeholder:text-muted focus:border-fg focus:outline-none";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clear);
  const subtotal = useCartSubtotal();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingVariantId, setConfirmingVariantId] = useState<string | null>(
    null,
  );

  const [cityQuery, setCityQuery] = useState("");
  const [cityResults, setCityResults] = useState<NovaPoshtaCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NovaPoshtaCity | null>(null);

  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [warehouseResults, setWarehouseResults] = useState<
    NovaPoshtaWarehouse[]
  >([]);
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<NovaPoshtaWarehouse | null>(null);

  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [resolvedQuoteKey, setResolvedQuoteKey] = useState<string | null>(null);

  const [showOtherPaymentOptions, setShowOtherPaymentOptions] = useState(false);

  // City search, debounced. Results are only fetched (not reset) here —
  // whether they're shown is a derived value below, so the effect never
  // needs to setState synchronously on its early-return paths.
  const cityQueryIsSettled = selectedCity && cityQuery === selectedCity.name;
  useEffect(() => {
    if (cityQueryIsSettled || cityQuery.trim().length < 2) return;
    const handle = setTimeout(async () => {
      const result = await searchCitiesAction(cityQuery);
      setCityResults(result.cities);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [cityQuery, cityQueryIsSettled]);
  const visibleCityResults =
    cityQueryIsSettled || cityQuery.trim().length < 2 ? [] : cityResults;

  // Warehouse search, debounced — only once a city is selected
  const warehouseQueryIsSettled =
    selectedWarehouse && warehouseQuery === selectedWarehouse.description;
  useEffect(() => {
    if (!selectedCity || warehouseQueryIsSettled) return;
    const handle = setTimeout(async () => {
      const result = await searchWarehousesAction(
        selectedCity.ref,
        warehouseQuery,
      );
      setWarehouseResults(result.warehouses);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [warehouseQuery, selectedCity, warehouseQueryIsSettled]);
  const visibleWarehouseResults = warehouseQueryIsSettled
    ? []
    : warehouseResults;

  // Live shipping cost preview once a city is picked. "Loading" is derived
  // by comparing the key of the currently-selected city+cart against the key
  // the last resolved quote was for, rather than tracked as its own piece of
  // state — the resolvedQuoteKey update only ever happens inside the async
  // .then callback, never synchronously in the effect body.
  const currentQuoteKey = selectedCity
    ? `${selectedCity.ref}|${items.map((i) => `${i.variantId}:${i.quantity}`).join(",")}`
    : null;
  useEffect(() => {
    if (!selectedCity || !currentQuoteKey) return;
    let cancelled = false;
    previewShippingCostAction({
      cityRef: selectedCity.ref,
      items: items.map((i) => ({
        variantId: i.variantId,
        quantity: i.quantity,
      })),
    }).then((result) => {
      if (cancelled) return;
      if ("cost" in result) {
        setShippingCost(result.cost);
        setResolvedQuoteKey(currentQuoteKey);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedCity, items, currentQuoteKey]);
  const visibleShippingCost =
    currentQuoteKey && resolvedQuoteKey === currentQuoteKey
      ? shippingCost
      : null;
  const visibleShippingCostLoading = Boolean(
    currentQuoteKey && resolvedQuoteKey !== currentQuoteKey,
  );

  function selectCity(city: NovaPoshtaCity) {
    setSelectedCity(city);
    setCityQuery(city.name);
    setCityResults([]);
    setSelectedWarehouse(null);
    setWarehouseQuery("");
    setWarehouseResults([]);
  }

  function selectWarehouse(warehouse: NovaPoshtaWarehouse) {
    setSelectedWarehouse(warehouse);
    setWarehouseQuery(warehouse.description);
    setWarehouseResults([]);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || !selectedCity || !selectedWarehouse) return;
    setSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();

    const result = await placeOrderAction({
      customerName: `${firstName} ${lastName}`.trim(),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      shippingCity: selectedCity.name,
      shippingCityRef: selectedCity.ref,
      shippingBranch: selectedWarehouse.description,
      shippingWarehouseRef: selectedWarehouse.ref,
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    });

    if (!result.success) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/order/${result.orderId}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="font-display text-5xl uppercase tracking-tight sm:text-6xl">
          Кошик
        </h1>
        <p className="mt-8 text-muted">Ваш кошик порожній.</p>
        <Link href="/catalog" className="mt-4 inline-block text-highlight">
          Продовжити покупки
        </Link>
      </div>
    );
  }

  const canSubmit = Boolean(selectedCity && selectedWarehouse);
  const total = subtotal + (visibleShippingCost ?? 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="font-display text-5xl uppercase tracking-tight sm:text-6xl">
        Кошик
      </h1>

      <div className="mt-12 grid gap-16 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="space-y-10">
          <section>
            <h2 className="text-xl font-semibold">Контактні дані</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              <input
                name="firstName"
                placeholder="Ім'я"
                required
                className={FIELD_CLASS}
              />
              <input
                name="lastName"
                placeholder="Прізвище"
                required
                className={FIELD_CLASS}
              />
              <input
                name="customerPhone"
                placeholder="Телефон"
                required
                className={FIELD_CLASS}
              />
              <input
                name="customerEmail"
                type="email"
                placeholder="Email (необов'язково)"
                className={FIELD_CLASS}
              />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Доставка Новою Поштою</h2>
            <div className="mt-4 space-y-3">
              <div className="relative">
                <input
                  value={cityQuery}
                  onChange={(e) => {
                    setCityQuery(e.target.value);
                    if (selectedCity && e.target.value !== selectedCity.name) {
                      setSelectedCity(null);
                    }
                  }}
                  placeholder="Місто"
                  required
                  autoComplete="off"
                  className={FIELD_CLASS}
                />
                {visibleCityResults.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto border border-border bg-bg">
                    {visibleCityResults.map((city) => (
                      <li key={city.ref}>
                        <button
                          type="button"
                          onClick={() => selectCity(city)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-surface"
                        >
                          {city.name}
                          {city.area ? (
                            <span className="text-muted"> · {city.area}</span>
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative">
                <input
                  value={warehouseQuery}
                  onChange={(e) => {
                    setWarehouseQuery(e.target.value);
                    if (
                      selectedWarehouse &&
                      e.target.value !== selectedWarehouse.description
                    ) {
                      setSelectedWarehouse(null);
                    }
                  }}
                  placeholder={
                    selectedCity ? "Відділення" : "Спочатку оберіть місто"
                  }
                  required
                  disabled={!selectedCity}
                  autoComplete="off"
                  className={`${FIELD_CLASS} disabled:opacity-40`}
                />
                {visibleWarehouseResults.length > 0 && (
                  <ul className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto border border-border bg-bg">
                    {visibleWarehouseResults.map((warehouse) => (
                      <li key={warehouse.ref}>
                        <button
                          type="button"
                          onClick={() => selectWarehouse(warehouse)}
                          className="block w-full px-3 py-2 text-left text-sm hover:bg-surface"
                        >
                          {warehouse.description}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold">Оплата</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 border-b border-border py-3">
                <span className="flex h-4 w-4 flex-none items-center justify-center rounded-full border border-highlight">
                  <span className="h-2 w-2 rounded-full bg-highlight" />
                </span>
                <span className="text-sm">Оплата карткою (Monobank)</span>
              </div>

              <button
                type="button"
                onClick={() => setShowOtherPaymentOptions((v) => !v)}
                className="text-sm text-highlight hover:underline"
              >
                {showOtherPaymentOptions ? "− " : "+ "}Інші варіанти оплати
              </button>
              {showOtherPaymentOptions ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <span className="border border-border px-3 py-2 text-sm uppercase tracking-wide text-muted">
                      PayPal
                    </span>
                    <span className="border border-border px-3 py-2 text-sm uppercase tracking-wide text-muted">
                      Крипта
                    </span>
                  </div>
                  <p className="text-sm text-muted">
                    Зверніться до покупця за додатковою інформацією оплати
                  </p>
                </div>
              ) : null}
            </div>
          </section>

          {error ? <p className="text-danger text-sm">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="w-full bg-fg py-4 text-sm uppercase tracking-wide text-bg hover:opacity-90 disabled:opacity-30"
          >
            {submitting ? "Оформлення..." : "Оформити замовлення"}
          </button>
        </form>

        <div>
          <h2 className="text-xl font-semibold">Кошик ({items.length})</h2>
          <div className="mt-4 divide-y divide-border">
            {items.map((item) => {
              const image = item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null;
              const confirming = confirmingVariantId === item.variantId;

              return (
                <div key={item.variantId} className="flex gap-4 py-4">
                  {item.slug ? (
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative h-24 w-20 flex-none bg-surface"
                    >
                      {image}
                    </Link>
                  ) : (
                    <div className="relative h-24 w-20 flex-none bg-surface">
                      {image}
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-4">
                      {item.slug ? (
                        <Link
                          href={`/products/${item.slug}`}
                          className="text-sm hover:text-highlight"
                        >
                          {item.name}
                        </Link>
                      ) : (
                        <p className="text-sm">{item.name}</p>
                      )}
                      <p className="flex-none text-sm">
                        {item.price * item.quantity} грн
                      </p>
                    </div>
                    <div className="text-sm text-muted">
                      {item.size ? <p>Розмір: {item.size}</p> : null}
                      <p>Кількість: {item.quantity}</p>
                    </div>

                    {confirming ? (
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-muted">Видалити товар?</span>
                        <button
                          type="button"
                          onClick={() => {
                            removeItem(item.variantId);
                            setConfirmingVariantId(null);
                          }}
                          className="text-danger hover:underline"
                        >
                          Так
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingVariantId(null)}
                          className="text-muted hover:underline"
                        >
                          Скасувати
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingVariantId(item.variantId)}
                        className="flex w-fit items-center gap-1 text-sm text-muted hover:text-danger"
                      >
                        <CloseIcon />
                        Видалити
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Сума</span>
              <span>{subtotal} грн</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Доставка</span>
              <span>
                {!selectedCity
                  ? "Оберіть місто"
                  : visibleShippingCostLoading
                    ? "Розрахунок..."
                    : visibleShippingCost !== null
                      ? `${visibleShippingCost} грн`
                      : "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
              <span>Разом</span>
              <span>{total} грн</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

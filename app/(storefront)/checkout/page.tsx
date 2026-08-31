"use client";

import { useEffect, useState } from "react";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { placeOrderAction } from "@/lib/actions/checkout";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { EmptyCartState } from "@/components/cart/EmptyCartState";
import { formatPrice } from "@/lib/format";
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

    try {
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
      // A hard navigation, not router.push() — confirmed via direct testing
      // that router.push() here reliably reports success (correct URL, no
      // thrown error) without the client-side router actually navigating,
      // leaving the user stuck on /checkout despite the order having gone
      // through. A full navigation sidesteps whatever that is entirely.
      window.location.href = `/order/${result.orderId}`;
    } catch {
      // Defense in depth: placeOrderAction itself shouldn't throw (it
      // catches its own non-critical failures), but if it ever does for an
      // unrelated reason, show a real error instead of leaving the button
      // stuck on "Оформлення..." with no feedback.
      setError("Не вдалося оформити замовлення. Спробуйте ще раз.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-center font-display text-5xl uppercase tracking-tight sm:text-6xl">
          Кошик
        </h1>
        <EmptyCartState />
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
        <form
          onSubmit={handleSubmit}
          className="max-w-xl space-y-10 lg:max-w-none"
        >
          <section>
            <h2 className="text-xl font-semibold">Контактні дані</h2>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3">
              <label htmlFor="checkout-firstName" className="sr-only">
                Ім&apos;я
              </label>
              <input
                id="checkout-firstName"
                name="firstName"
                placeholder="Ім'я"
                required
                className={FIELD_CLASS}
              />
              <label htmlFor="checkout-lastName" className="sr-only">
                Прізвище
              </label>
              <input
                id="checkout-lastName"
                name="lastName"
                placeholder="Прізвище"
                required
                className={FIELD_CLASS}
              />
              <label htmlFor="checkout-phone" className="sr-only">
                Телефон
              </label>
              <input
                id="checkout-phone"
                name="customerPhone"
                placeholder="Телефон"
                required
                className={FIELD_CLASS}
              />
              <label htmlFor="checkout-email" className="sr-only">
                Email (необов&apos;язково)
              </label>
              <input
                id="checkout-email"
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
                <label htmlFor="checkout-city" className="sr-only">
                  Місто
                </label>
                <input
                  id="checkout-city"
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
                <label htmlFor="checkout-warehouse" className="sr-only">
                  Відділення
                </label>
                <input
                  id="checkout-warehouse"
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
            {items.map((item) => (
              <CartItemRow
                key={item.variantId}
                item={item}
                confirming={confirmingVariantId === item.variantId}
                onRequestDelete={() => setConfirmingVariantId(item.variantId)}
                onConfirmDelete={() => {
                  removeItem(item.variantId);
                  setConfirmingVariantId(null);
                }}
                onCancelDelete={() => setConfirmingVariantId(null)}
              />
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Сума</span>
              <span>{formatPrice(subtotal)} грн</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Доставка</span>
              <span>
                {!selectedCity
                  ? "Оберіть місто"
                  : visibleShippingCostLoading
                    ? "Розрахунок..."
                    : visibleShippingCost !== null
                      ? `${formatPrice(visibleShippingCost)} грн`
                      : "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold">
              <span>Разом</span>
              <span>{formatPrice(total)} грн</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

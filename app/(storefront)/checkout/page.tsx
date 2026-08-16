"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { placeOrderAction } from "@/lib/actions/checkout";
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

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const subtotal = useCartSubtotal();
  const router = useRouter();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const result = await placeOrderAction({
      customerName: String(formData.get("customerName") ?? ""),
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
        <h1 className="font-display text-3xl uppercase tracking-tight">
          Checkout
        </h1>
        <p className="mt-8 text-muted">Your bag is empty.</p>
      </div>
    );
  }

  const canSubmit = Boolean(selectedCity && selectedWarehouse);
  const total = subtotal + (visibleShippingCost ?? 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 grid gap-10 sm:grid-cols-2">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-sm uppercase tracking-wide text-muted mb-3">
            Contact
          </h2>
          <div className="space-y-3">
            <input
              name="customerName"
              placeholder="Full name"
              required
              className="w-full border border-border bg-transparent px-3 py-2"
            />
            <input
              name="customerPhone"
              placeholder="Phone"
              required
              className="w-full border border-border bg-transparent px-3 py-2"
            />
            <input
              name="customerEmail"
              type="email"
              placeholder="Email (optional)"
              className="w-full border border-border bg-transparent px-3 py-2"
            />
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-wide text-muted mb-3">
            Nova Poshta delivery
          </h2>
          <div className="space-y-3">
            <div className="relative">
              <input
                value={cityQuery}
                onChange={(e) => {
                  setCityQuery(e.target.value);
                  if (selectedCity && e.target.value !== selectedCity.name) {
                    setSelectedCity(null);
                  }
                }}
                placeholder="City"
                required
                autoComplete="off"
                className="w-full border border-border bg-transparent px-3 py-2"
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
                placeholder={selectedCity ? "Branch" : "Select a city first"}
                required
                disabled={!selectedCity}
                autoComplete="off"
                className="w-full border border-border bg-transparent px-3 py-2 disabled:opacity-40"
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
        </div>

        {error ? <p className="text-danger text-sm">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="w-full border border-fg py-3 text-sm uppercase tracking-wide hover:bg-fg hover:text-bg disabled:opacity-30"
        >
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>

      <div>
        <h2 className="text-sm uppercase tracking-wide text-muted mb-3">
          Order summary
        </h2>
        <div className="divide-y divide-border">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="flex justify-between py-3 text-sm"
            >
              <span>
                {item.name} {item.size ? `(${item.size})` : ""} ×{" "}
                {item.quantity}
              </span>
              <span>{item.price * item.quantity} UAH</span>
            </div>
          ))}
        </div>
        <div className="mt-2 space-y-1">
          <div className="flex justify-between">
            <span className="uppercase tracking-wide text-sm">Subtotal</span>
            <span>{subtotal} UAH</span>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Shipping</span>
            <span>
              {!selectedCity
                ? "Select a city"
                : visibleShippingCostLoading
                  ? "Calculating..."
                  : visibleShippingCost !== null
                    ? `${visibleShippingCost} UAH`
                    : "—"}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 mt-1 text-accent">
            <span className="uppercase tracking-wide">Total</span>
            <span>{total} UAH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

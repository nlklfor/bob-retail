import { describe, test, expect, beforeEach, mock } from "bun:test";

type MockVariant = {
  id: string;
  weight_grams: number;
  products: { price: number } | null;
};

let mockVariants: MockVariant[] = [];
let mockVariantsError: unknown = null;

mock.module("@/lib/supabase/server", () => ({
  createAdminClient: () => ({
    from: () => ({
      select: () => ({
        in: (_col: string, ids: string[]) =>
          Promise.resolve({
            data: mockVariantsError
              ? null
              : mockVariants.filter((v) => ids.includes(v.id)),
            error: mockVariantsError,
          }),
      }),
    }),
  }),
}));

const getSenderCityRefMock = mock(
  async (): Promise<string | null> => "sender-ref",
);
const calculateDeliveryCostMock = mock(async () => 123);

mock.module("./client", () => ({
  getSenderCityRef: getSenderCityRefMock,
  calculateDeliveryCost: calculateDeliveryCostMock,
}));

const { resolveShippingCost } = await import("./pricing");

const FLAT_FALLBACK = 80;

describe("resolveShippingCost", () => {
  beforeEach(() => {
    mockVariants = [];
    mockVariantsError = null;
    getSenderCityRefMock.mockReset();
    getSenderCityRefMock.mockImplementation(async () => "sender-ref");
    calculateDeliveryCostMock.mockReset();
    calculateDeliveryCostMock.mockImplementation(async () => 123);
  });

  test("falls back to the flat cost when no sender city is configured", async () => {
    getSenderCityRefMock.mockImplementation(async () => null);

    const cost = await resolveShippingCost("city-ref", [
      { variantId: "v1", quantity: 1 },
    ]);

    expect(cost).toBe(FLAT_FALLBACK);
    expect(calculateDeliveryCostMock).not.toHaveBeenCalled();
  });

  test("computes real weight and declared value from variant data", async () => {
    mockVariants = [
      { id: "v1", weight_grams: 400, products: { price: 500 } },
      { id: "v2", weight_grams: 600, products: { price: 800 } },
    ];

    const cost = await resolveShippingCost("city-ref", [
      { variantId: "v1", quantity: 2 }, // 800g, 1000 UAH
      { variantId: "v2", quantity: 1 }, // 600g, 800 UAH
    ]);

    expect(cost).toBe(123);
    expect(calculateDeliveryCostMock).toHaveBeenCalledWith({
      citySenderRef: "sender-ref",
      cityRecipientRef: "city-ref",
      weightKg: 1.4,
      declaredValue: 1800,
    });
  });

  test("enforces a minimum weight floor for very light orders", async () => {
    mockVariants = [{ id: "v1", weight_grams: 50, products: { price: 100 } }];

    await resolveShippingCost("city-ref", [{ variantId: "v1", quantity: 1 }]);

    expect(calculateDeliveryCostMock).toHaveBeenCalledWith(
      expect.objectContaining({ weightKg: 0.1 }),
    );
  });

  test("falls back to the flat cost when the Nova Poshta call fails", async () => {
    mockVariants = [{ id: "v1", weight_grams: 500, products: { price: 500 } }];
    calculateDeliveryCostMock.mockImplementation(async () => {
      throw new Error("Nova Poshta is down");
    });

    const cost = await resolveShippingCost("city-ref", [
      { variantId: "v1", quantity: 1 },
    ]);

    expect(cost).toBe(FLAT_FALLBACK);
  });

  test("falls back to the flat cost on a database error", async () => {
    mockVariantsError = new Error("db unreachable");

    const cost = await resolveShippingCost("city-ref", [
      { variantId: "v1", quantity: 1 },
    ]);

    expect(cost).toBe(FLAT_FALLBACK);
  });
});

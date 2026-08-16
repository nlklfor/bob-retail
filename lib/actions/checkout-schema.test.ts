import { describe, test, expect } from "bun:test";
import { checkoutSchema } from "./checkout-schema";

function validInput(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    customerName: "Тест Тестенко",
    customerPhone: "+380501234567",
    customerEmail: "",
    shippingCity: "Київ",
    shippingCityRef: "city-ref",
    shippingBranch: "Відділення №1",
    shippingWarehouseRef: "wh-ref",
    items: [{ variantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6", quantity: 1 }],
    ...overrides,
  };
}

describe("checkoutSchema", () => {
  test("accepts a fully valid order", () => {
    expect(checkoutSchema.safeParse(validInput()).success).toBe(true);
  });

  test("accepts an omitted email", () => {
    const result = checkoutSchema.safeParse(
      validInput({ customerEmail: undefined }),
    );
    expect(result.success).toBe(true);
  });

  test("rejects an invalid email when one is provided", () => {
    const result = checkoutSchema.safeParse(
      validInput({ customerEmail: "not-an-email" }),
    );
    expect(result.success).toBe(false);
  });

  test("rejects an empty cart", () => {
    const result = checkoutSchema.safeParse(validInput({ items: [] }));
    expect(result.success).toBe(false);
  });

  test("rejects a non-uuid variantId", () => {
    const result = checkoutSchema.safeParse(
      validInput({ items: [{ variantId: "not-a-uuid", quantity: 1 }] }),
    );
    expect(result.success).toBe(false);
  });

  test("rejects a quantity above the per-line cap", () => {
    const result = checkoutSchema.safeParse(
      validInput({
        items: [
          {
            variantId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            quantity: 21,
          },
        ],
      }),
    );
    expect(result.success).toBe(false);
  });

  test("rejects a missing shippingCityRef (city not actually selected)", () => {
    const result = checkoutSchema.safeParse(
      validInput({ shippingCityRef: "" }),
    );
    expect(result.success).toBe(false);
  });

  test("rejects a missing shippingWarehouseRef (branch not actually selected)", () => {
    const result = checkoutSchema.safeParse(
      validInput({ shippingWarehouseRef: "" }),
    );
    expect(result.success).toBe(false);
  });
});

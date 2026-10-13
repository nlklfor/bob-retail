import { describe, test, expect } from "bun:test";
import {
  calcPromoDiscount,
  describePromo,
  normalizePromoCode,
  type AppliedPromo,
} from "./promo-discount";

const freeShipping: AppliedPromo = {
  code: "BOBFREE",
  kind: "free_shipping",
  amount: null,
  minOrderAmount: null,
};

const minus200: AppliedPromo = {
  code: "BOB200",
  kind: "fixed_amount",
  amount: 200,
  minOrderAmount: null,
};

// Must stay in step with place_order()'s promo branch — this is only the
// checkout preview, the database computes the amount actually charged.
describe("calcPromoDiscount", () => {
  test("free delivery discounts exactly the shipping cost", () => {
    expect(calcPromoDiscount(freeShipping, 3999, 85)).toBe(85);
  });

  test("free delivery before shipping is quoted discounts nothing yet", () => {
    expect(calcPromoDiscount(freeShipping, 3999, 0)).toBe(0);
  });

  test("fixed amount comes off the goods", () => {
    expect(calcPromoDiscount(minus200, 3999, 85)).toBe(200);
  });

  test("fixed amount never exceeds the goods total", () => {
    expect(calcPromoDiscount(minus200, 150, 85)).toBe(150);
  });

  test("below the minimum order amount, nothing applies", () => {
    const withMin = { ...minus200, minOrderAmount: 2000 };
    expect(calcPromoDiscount(withMin, 1999, 85)).toBe(0);
    expect(calcPromoDiscount(withMin, 2000, 85)).toBe(200);
  });
});

describe("normalizePromoCode", () => {
  test("trims and uppercases", () => {
    expect(normalizePromoCode("  bobfree ")).toBe("BOBFREE");
  });
});

describe("describePromo", () => {
  test("describes both kinds in Ukrainian", () => {
    expect(describePromo(freeShipping)).toBe("безкоштовна доставка");
    expect(describePromo(minus200)).toBe("знижка 200 грн");
  });
});

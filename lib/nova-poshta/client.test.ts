import { describe, test, expect, beforeEach, mock } from "bun:test";
import {
  searchCities,
  getWarehouses,
  calculateDeliveryCost,
  getSenderCityRef,
} from "./client";

function jsonResponse(body: unknown, ok = true) {
  return Promise.resolve({
    ok,
    status: ok ? 200 : 500,
    json: () => Promise.resolve(body),
  } as Response);
}

describe("nova-poshta client", () => {
  beforeEach(() => {
    process.env.NOVA_POST_API_KEY = "test-key";
  });

  test("searchCities returns [] without calling the API for an empty query", async () => {
    const fetchMock = mock(() => jsonResponse({ success: true, data: [] }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await searchCities("  ");

    expect(result).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("searchCities maps raw API fields to the typed shape", async () => {
    global.fetch = mock(() =>
      jsonResponse({
        success: true,
        data: [
          { Ref: "ref-1", Description: "Київ", AreaDescription: "Київська" },
        ],
      }),
    ) as unknown as typeof fetch;

    const result = await searchCities("Київ");

    expect(result).toEqual([{ ref: "ref-1", name: "Київ", area: "Київська" }]);
  });

  test("searchCities surfaces the API's error message on failure", async () => {
    global.fetch = mock(() =>
      jsonResponse({
        success: false,
        data: [],
        errors: ["FindByString is not specified"],
      }),
    ) as unknown as typeof fetch;

    await expect(searchCities("Kyiv")).rejects.toThrow(
      "FindByString is not specified",
    );
  });

  test("getWarehouses returns [] without calling the API when cityRef is empty", async () => {
    const fetchMock = mock(() => jsonResponse({ success: true, data: [] }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const result = await getWarehouses("");

    expect(result).toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("getWarehouses maps raw API fields to the typed shape", async () => {
    global.fetch = mock(() =>
      jsonResponse({
        success: true,
        data: [
          {
            Ref: "wh-1",
            Description: "Відділення №1",
            ShortAddress: "вул. Х, 1",
            Number: "1",
          },
        ],
      }),
    ) as unknown as typeof fetch;

    const result = await getWarehouses("city-ref");

    expect(result).toEqual([
      {
        ref: "wh-1",
        description: "Відділення №1",
        shortAddress: "вул. Х, 1",
        number: "1",
      },
    ]);
  });

  test("calculateDeliveryCost parses a numeric Cost field", async () => {
    global.fetch = mock(() =>
      jsonResponse({ success: true, data: [{ Cost: 95 }] }),
    ) as unknown as typeof fetch;

    const cost = await calculateDeliveryCost({
      citySenderRef: "a",
      cityRecipientRef: "b",
      weightKg: 1,
      declaredValue: 1000,
    });

    expect(cost).toBe(95);
  });

  test("calculateDeliveryCost parses a string Cost field", async () => {
    global.fetch = mock(() =>
      jsonResponse({ success: true, data: [{ Cost: "95.00" }] }),
    ) as unknown as typeof fetch;

    const cost = await calculateDeliveryCost({
      citySenderRef: "a",
      cityRecipientRef: "b",
      weightKg: 1,
      declaredValue: 1000,
    });

    expect(cost).toBe(95);
  });

  test("calculateDeliveryCost throws if Cost isn't a valid number", async () => {
    global.fetch = mock(() =>
      jsonResponse({ success: true, data: [{}] }),
    ) as unknown as typeof fetch;

    await expect(
      calculateDeliveryCost({
        citySenderRef: "a",
        cityRecipientRef: "b",
        weightKg: 1,
        declaredValue: 1000,
      }),
    ).rejects.toThrow();
  });

  test("getSenderCityRef returns null without calling the API when unset", async () => {
    delete process.env.NOVA_POST_SENDER_CITY_NAME;
    const fetchMock = mock(() => jsonResponse({ success: true, data: [] }));
    global.fetch = fetchMock as unknown as typeof fetch;

    const ref = await getSenderCityRef();

    expect(ref).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

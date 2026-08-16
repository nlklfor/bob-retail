import "server-only";

// Thin wrapper around the Nova Poshta v2.0 JSON API.
// Docs contract (modelName/calledMethod/methodProperties) verified against
// the official API + production SDKs — see https://developers.novaposhta.ua.
const API_URL = "https://api.novaposhta.ua/v2.0/json/";

type NovaPoshtaResponse<T> = {
  success: boolean;
  data: T[];
  errors: string[];
};

async function callNovaPoshta<T>(
  modelName: string,
  calledMethod: string,
  methodProperties: Record<string, unknown>,
): Promise<T[]> {
  const apiKey = process.env.NOVA_POST_API_KEY;
  if (!apiKey) {
    throw new Error("NOVA_POST_API_KEY is not configured.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, modelName, calledMethod, methodProperties }),
  });

  if (!res.ok) {
    throw new Error(`Nova Poshta API request failed (${res.status}).`);
  }

  const json = (await res.json()) as NovaPoshtaResponse<T>;
  if (!json.success) {
    throw new Error(json.errors?.[0] || "Nova Poshta API returned an error.");
  }
  return json.data;
}

export type NovaPoshtaCity = {
  ref: string;
  name: string;
  area: string;
};

export type NovaPoshtaWarehouse = {
  ref: string;
  description: string;
  shortAddress: string;
  number: string;
};

type RawCity = {
  Ref: string;
  Description: string;
  AreaDescription?: string;
};

type RawWarehouse = {
  Ref: string;
  Description: string;
  ShortAddress: string;
  Number: string;
};

export async function searchCities(query: string): Promise<NovaPoshtaCity[]> {
  if (!query.trim()) return [];

  const data = await callNovaPoshta<RawCity>("Address", "getCities", {
    FindByString: query,
    Limit: "20",
  });

  return data.map((c) => ({
    ref: c.Ref,
    name: c.Description,
    area: c.AreaDescription ?? "",
  }));
}

export async function getWarehouses(
  cityRef: string,
  query = "",
): Promise<NovaPoshtaWarehouse[]> {
  if (!cityRef) return [];

  const data = await callNovaPoshta<RawWarehouse>("Address", "getWarehouses", {
    CityRef: cityRef,
    FindByString: query,
    Limit: "50",
  });

  return data.map((w) => ({
    ref: w.Ref,
    description: w.Description,
    shortAddress: w.ShortAddress,
    number: w.Number,
  }));
}

export async function calculateDeliveryCost(params: {
  citySenderRef: string;
  cityRecipientRef: string;
  weightKg: number;
  declaredValue: number;
}): Promise<number> {
  const data = await callNovaPoshta<{ Cost: string }>(
    "InternetDocument",
    "getDocumentPrice",
    {
      CitySender: params.citySenderRef,
      CityRecipient: params.cityRecipientRef,
      Weight: params.weightKg,
      ServiceType: "WarehouseWarehouse",
      Cost: params.declaredValue,
      CargoType: "Cargo",
      SeatsAmount: 1,
    },
  );

  const cost = Number(data[0]?.Cost);
  if (!Number.isFinite(cost)) {
    throw new Error("Nova Poshta did not return a valid delivery cost.");
  }
  return cost;
}

// Resolves NOVA_POST_SENDER_CITY_NAME (the city the shop ships from) to a
// Nova Poshta city Ref, cached in memory for the life of the server process
// since the sender city never changes at runtime. Returns null if the env
// var isn't set yet, so callers can fall back gracefully.
let cachedSenderCityRef: string | null = null;

export async function getSenderCityRef(): Promise<string | null> {
  if (cachedSenderCityRef) return cachedSenderCityRef;

  const senderCityName = process.env.NOVA_POST_SENDER_CITY_NAME;
  if (!senderCityName) return null;

  const cities = await searchCities(senderCityName);
  const exactMatch = cities.find(
    (c) => c.name.toLowerCase() === senderCityName.toLowerCase(),
  );
  const match = exactMatch ?? cities[0];
  if (!match) return null;

  cachedSenderCityRef = match.ref;
  return cachedSenderCityRef;
}

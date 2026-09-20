// Real published size-conversion charts, sourced per brand (not
// generated/guessed) — see each section's comment for where the numbers
// came from. Men's adult sneaker sizing per brand, since that's what's
// actually carried across BOB's catalog for these 7 labels. The BOB chart
// is the generic EU/UK/US/CM fallback for any brand not in this list,
// split into Men/Women/Kids per the client's own request.

export type SizeRow = {
  eu: string;
  uk: string;
  us: string;
  cm: string;
};

export type SizeChart = {
  label: string;
  rows: SizeRow[];
  note?: string;
};

// Source: outsole.nl brand comparison charts (Nike, Adidas, New Balance,
// Asics men's).
const NIKE: SizeChart = {
  label: "Nike",
  rows: [
    { eu: "35", uk: "2.5", us: "3", cm: "22" },
    { eu: "35.5", uk: "3", us: "3.5", cm: "22.5" },
    { eu: "36", uk: "3.5", us: "4", cm: "23" },
    { eu: "36.5", uk: "4", us: "4.5", cm: "23.5" },
    { eu: "37.5", uk: "4.5", us: "5", cm: "23.5" },
    { eu: "38", uk: "5", us: "5.5", cm: "24" },
    { eu: "38.5", uk: "5.5", us: "6", cm: "24" },
    { eu: "39", uk: "6", us: "6.5", cm: "24.5" },
    { eu: "40", uk: "6", us: "7", cm: "25" },
    { eu: "40.5", uk: "6.5", us: "7.5", cm: "25.5" },
    { eu: "41", uk: "7", us: "8", cm: "26" },
    { eu: "42", uk: "7.5", us: "8.5", cm: "26.5" },
    { eu: "42.5", uk: "8", us: "9", cm: "27" },
    { eu: "43", uk: "8.5", us: "9.5", cm: "27.5" },
    { eu: "44", uk: "9", us: "10", cm: "28" },
    { eu: "44.5", uk: "9.5", us: "10.5", cm: "28.5" },
    { eu: "45", uk: "10", us: "11", cm: "29" },
    { eu: "45.5", uk: "10.5", us: "11.5", cm: "29.5" },
    { eu: "46", uk: "11", us: "12", cm: "30" },
    { eu: "47", uk: "11.5", us: "12.5", cm: "30.5" },
    { eu: "47.5", uk: "12", us: "13", cm: "31" },
    { eu: "48", uk: "12.5", us: "13.5", cm: "31.5" },
    { eu: "48.5", uk: "13", us: "14", cm: "32" },
  ],
};

const ADIDAS: SizeChart = {
  label: "Adidas",
  rows: [
    { eu: "35⅓", uk: "3", us: "3.5", cm: "21.6" },
    { eu: "36", uk: "3.5", us: "4", cm: "22.1" },
    { eu: "36⅔", uk: "4", us: "4.5", cm: "22.5" },
    { eu: "37⅓", uk: "4.5", us: "5", cm: "22.9" },
    { eu: "38", uk: "5", us: "5.5", cm: "23.3" },
    { eu: "38⅔", uk: "5.5", us: "6", cm: "23.8" },
    { eu: "39⅓", uk: "6", us: "6.5", cm: "24.2" },
    { eu: "40", uk: "6.5", us: "7", cm: "24.6" },
    { eu: "40⅔", uk: "7", us: "7.5", cm: "25" },
    { eu: "41⅓", uk: "7.5", us: "8", cm: "25.5" },
    { eu: "42", uk: "8", us: "8.5", cm: "25.9" },
    { eu: "42⅔", uk: "8.5", us: "9", cm: "26.3" },
    { eu: "43⅓", uk: "9", us: "9.5", cm: "26.7" },
    { eu: "44", uk: "9.5", us: "10", cm: "27.1" },
    { eu: "44⅔", uk: "10", us: "10.5", cm: "27.6" },
    { eu: "45⅓", uk: "10.5", us: "11", cm: "28" },
    { eu: "46", uk: "11", us: "11.5", cm: "28.4" },
    { eu: "46⅔", uk: "11.5", us: "12", cm: "28.8" },
    { eu: "47⅓", uk: "12", us: "12.5", cm: "29.3" },
    { eu: "48", uk: "12.5", us: "13", cm: "29.7" },
  ],
};

const ASICS: SizeChart = {
  label: "Asics",
  rows: [
    { eu: "35.5", uk: "3", us: "3.5", cm: "22" },
    { eu: "36", uk: "3", us: "4", cm: "22.5" },
    { eu: "37", uk: "3.5", us: "4.5", cm: "23" },
    { eu: "37.5", uk: "4", us: "5", cm: "23.5" },
    { eu: "38", uk: "4.5", us: "5.5", cm: "24" },
    { eu: "39", uk: "5", us: "6", cm: "24.5" },
    { eu: "39.5", uk: "5.5", us: "6.5", cm: "25" },
    { eu: "40", uk: "6", us: "7", cm: "25.25" },
    { eu: "40.5", uk: "6.5", us: "7.5", cm: "25.5" },
    { eu: "41.5", uk: "7", us: "8", cm: "26" },
    { eu: "42", uk: "7.5", us: "8.5", cm: "26.5" },
    { eu: "42.5", uk: "8", us: "9", cm: "27" },
    { eu: "43.5", uk: "8.5", us: "9.5", cm: "27.5" },
    { eu: "44", uk: "9", us: "10", cm: "28" },
    { eu: "44.5", uk: "9.5", us: "10.5", cm: "28.25" },
    { eu: "45", uk: "10", us: "11", cm: "28.5" },
    { eu: "46", uk: "10.5", us: "11.5", cm: "29" },
    { eu: "46.5", uk: "11", us: "12", cm: "29.5" },
    { eu: "47", uk: "11.5", us: "12.5", cm: "30" },
    { eu: "48", uk: "12", us: "13", cm: "30.5" },
    { eu: "48.5", uk: "12.5", us: "13.5", cm: "30.75" },
  ],
};

const NEW_BALANCE: SizeChart = {
  label: "New Balance",
  rows: [
    { eu: "35", uk: "2.5", us: "3", cm: "21" },
    { eu: "35.5", uk: "3", us: "3.5", cm: "21.5" },
    { eu: "36", uk: "3.5", us: "4", cm: "22" },
    { eu: "37", uk: "4", us: "4.5", cm: "22.5" },
    { eu: "37.5", uk: "4.5", us: "5", cm: "23" },
    { eu: "38", uk: "5", us: "5.5", cm: "23.5" },
    { eu: "38.5", uk: "5.5", us: "6", cm: "24" },
    { eu: "39.5", uk: "6", us: "6.5", cm: "24.5" },
    { eu: "40", uk: "6.5", us: "7", cm: "25" },
    { eu: "40.5", uk: "7", us: "7.5", cm: "25.5" },
    { eu: "41.5", uk: "7.5", us: "8", cm: "26" },
    { eu: "42", uk: "8", us: "8.5", cm: "26.5" },
    { eu: "42.5", uk: "8.5", us: "9", cm: "27" },
    { eu: "43", uk: "9", us: "9.5", cm: "27.5" },
    { eu: "44", uk: "9.5", us: "10", cm: "28" },
    { eu: "44.5", uk: "10", us: "10.5", cm: "28.5" },
    { eu: "45", uk: "10.5", us: "11", cm: "29" },
    { eu: "45.5", uk: "11", us: "11.5", cm: "29.5" },
    { eu: "46.5", uk: "11.5", us: "12", cm: "30" },
    { eu: "47", uk: "12", us: "12.5", cm: "30.5" },
    { eu: "47.5", uk: "12.5", us: "13", cm: "31" },
  ],
};

// Source: footshop.eu official brand size-chart pages (Off-White, Salomon).
const OFF_WHITE: SizeChart = {
  label: "Off-White",
  rows: [
    { eu: "35", uk: "3", us: "4", cm: "23.1" },
    { eu: "36", uk: "4", us: "5", cm: "23.8" },
    { eu: "37", uk: "4.5", us: "5.5", cm: "24.5" },
    { eu: "38", uk: "5.5", us: "6.5", cm: "25.1" },
    { eu: "39", uk: "6.5", us: "7.5", cm: "25.8" },
    { eu: "40", uk: "7", us: "8", cm: "26.5" },
    { eu: "41", uk: "8", us: "9", cm: "27.1" },
    { eu: "42", uk: "8.5", us: "9.5", cm: "27.8" },
    { eu: "43", uk: "9", us: "10", cm: "28.5" },
    { eu: "44", uk: "10", us: "11", cm: "29.1" },
    { eu: "45", uk: "11", us: "12", cm: "29.8" },
    { eu: "46", uk: "12", us: "13", cm: "30.5" },
    { eu: "47", uk: "13", us: "14", cm: "31.1" },
    { eu: "48", uk: "14", us: "15", cm: "31.8" },
  ],
};

const SALOMON: SizeChart = {
  label: "Salomon",
  rows: [
    { eu: "36", uk: "3.5", us: "4", cm: "21.5" },
    { eu: "36⅔", uk: "4", us: "4.5", cm: "22" },
    { eu: "37⅓", uk: "4.5", us: "5", cm: "22.5" },
    { eu: "38", uk: "5", us: "5.5", cm: "23" },
    { eu: "38⅔", uk: "5.5", us: "6", cm: "23.5" },
    { eu: "39⅓", uk: "6", us: "6.5", cm: "24" },
    { eu: "40", uk: "6.5", us: "7", cm: "24.5" },
    { eu: "40⅔", uk: "7", us: "7.5", cm: "25" },
    { eu: "41⅓", uk: "7.5", us: "8", cm: "25.5" },
    { eu: "42", uk: "8", us: "8.5", cm: "26" },
    { eu: "42⅔", uk: "8.5", us: "9", cm: "26.5" },
    { eu: "43⅓", uk: "9", us: "9.5", cm: "27" },
    { eu: "44", uk: "9.5", us: "10", cm: "27.5" },
    { eu: "44⅔", uk: "10", us: "10.5", cm: "28" },
    { eu: "45⅓", uk: "10.5", us: "11", cm: "28.5" },
    { eu: "46", uk: "11", us: "11.5", cm: "29" },
    { eu: "46⅔", uk: "11.5", us: "12", cm: "29.5" },
    { eu: "47⅓", uk: "12", us: "12.5", cm: "30" },
    { eu: "48", uk: "12.5", us: "13", cm: "30.5" },
    { eu: "48⅔", uk: "13", us: "13.5", cm: "31" },
    { eu: "49⅓", uk: "13.5", us: "14", cm: "31.5" },
    { eu: "50", uk: "14", us: "14.5", cm: "32" },
    { eu: "50⅔", uk: "14.5", us: "15", cm: "32.5" },
  ],
};

// Source: premiata.it official size-chart page. Premiata's own JP column is
// foot length in cm (Japanese sizing is literally the foot length), used
// here as the CM column.
const PREMIATA: SizeChart = {
  label: "Premiata",
  rows: [
    { eu: "38", uk: "4", us: "5", cm: "23" },
    { eu: "38.5", uk: "4.5", us: "5.5", cm: "23.5" },
    { eu: "39", uk: "5", us: "6", cm: "24" },
    { eu: "39.5", uk: "5.5", us: "6.5", cm: "24.5" },
    { eu: "40", uk: "6", us: "7", cm: "25" },
    { eu: "40.5", uk: "6.5", us: "7.5", cm: "25.5" },
    { eu: "41", uk: "7", us: "8", cm: "26" },
    { eu: "41.5", uk: "7.5", us: "8.5", cm: "26.5" },
    { eu: "42", uk: "8", us: "9", cm: "27" },
    { eu: "42.5", uk: "8.5", us: "9.5", cm: "27.5" },
    { eu: "43", uk: "9", us: "10", cm: "28" },
    { eu: "43.5", uk: "9.5", us: "10.5", cm: "28.5" },
    { eu: "44", uk: "10", us: "11", cm: "29" },
    { eu: "44.5", uk: "10.5", us: "11.5", cm: "29.5" },
    { eu: "45", uk: "11", us: "12", cm: "30" },
    { eu: "45.5", uk: "11.5", us: "12.5", cm: "30.5" },
    { eu: "46", uk: "12", us: "13", cm: "31" },
    { eu: "46.5", uk: "12.5", us: "13.5", cm: "31.5" },
    { eu: "47", uk: "13", us: "14", cm: "32" },
  ],
};

export const BRAND_SIZE_CHARTS: Record<string, SizeChart> = {
  nike: NIKE,
  adidas: ADIDAS,
  asics: ASICS,
  "new-balance": NEW_BALANCE,
  premiata: PREMIATA,
  "off-white": OFF_WHITE,
  salomon: SALOMON,
};

export const BRAND_ORDER = [
  "nike",
  "adidas",
  "asics",
  "new-balance",
  "premiata",
  "off-white",
  "salomon",
] as const;

// BOB's own generic fallback chart — for any brand not in the list above.
// Source: sizefit.org's generic/standard men's chart (the only one found
// with half-sizes reaching EU 49.5-50, matching the requested range) for
// Men; urbanstylefootwear.com's generic charts for Women and Kids.
const BOB_MEN: SizeChart = {
  label: "Чоловічі",
  rows: [
    { eu: "34", uk: "2", us: "3", cm: "21.5" },
    { eu: "34.5", uk: "2.5", us: "3.5", cm: "21.5" },
    { eu: "35", uk: "3", us: "4", cm: "22" },
    { eu: "35.5", uk: "3.5", us: "4.5", cm: "22.5" },
    { eu: "36", uk: "4", us: "5", cm: "22.5" },
    { eu: "37", uk: "4.5", us: "5.5", cm: "23" },
    { eu: "37.5", uk: "5", us: "6", cm: "23.5" },
    { eu: "38", uk: "5.5", us: "6.5", cm: "24" },
    { eu: "38.5", uk: "5.5", us: "6.5", cm: "24.5" },
    { eu: "39", uk: "6", us: "7", cm: "24.5" },
    { eu: "39.5", uk: "6.5", us: "7.5", cm: "25" },
    { eu: "40", uk: "7", us: "8", cm: "25.5" },
    { eu: "41", uk: "7.5", us: "8.5", cm: "26" },
    { eu: "41.5", uk: "8", us: "9", cm: "26.5" },
    { eu: "42", uk: "8.5", us: "9.5", cm: "27" },
    { eu: "42.5", uk: "9", us: "10", cm: "27" },
    { eu: "43", uk: "9.5", us: "10.5", cm: "27.5" },
    { eu: "44", uk: "10", us: "11", cm: "28" },
    { eu: "44.5", uk: "10.5", us: "11.5", cm: "28.5" },
    { eu: "45", uk: "11", us: "12", cm: "28.5" },
    { eu: "45.5", uk: "11.5", us: "12.5", cm: "28.5" },
    { eu: "46", uk: "11.5", us: "12.5", cm: "29" },
    { eu: "46.5", uk: "12", us: "13", cm: "29.5" },
    { eu: "47", uk: "12.5", us: "13.5", cm: "30" },
    { eu: "47.5", uk: "13", us: "14", cm: "30.5" },
    { eu: "48", uk: "13", us: "14", cm: "30.5" },
    { eu: "48.5", uk: "13.5", us: "14.5", cm: "31" },
    { eu: "49", uk: "14", us: "15", cm: "31.5" },
    { eu: "49.5", uk: "14.5", us: "15.5", cm: "31.5" },
  ],
};

const BOB_WOMEN: SizeChart = {
  label: "Жіночі",
  rows: [
    { eu: "34", uk: "2", us: "4", cm: "21.2" },
    { eu: "35", uk: "3", us: "5", cm: "22" },
    { eu: "36", uk: "4", us: "6", cm: "22.9" },
    { eu: "38", uk: "5", us: "7", cm: "23.7" },
    { eu: "39", uk: "6", us: "8", cm: "24.6" },
    { eu: "40", uk: "7", us: "9", cm: "25.4" },
    { eu: "41", uk: "8", us: "10", cm: "26.2" },
    { eu: "43", uk: "9", us: "11", cm: "27.1" },
    { eu: "44", uk: "10", us: "12", cm: "27.9" },
  ],
};

const BOB_KIDS: SizeChart = {
  label: "Дитячі",
  note: "US-розмір переходить із дитячої шкали (C) на підліткову (Y) в районі EU 32-33 — це нормально, не помилка в таблиці.",
  rows: [
    { eu: "28", uk: "9.5", us: "10.5C", cm: "17.1" },
    { eu: "30", uk: "11", us: "12C", cm: "18.4" },
    { eu: "32", uk: "12.5", us: "13.5C", cm: "19.7" },
    { eu: "32", uk: "13", us: "1Y", cm: "20.1" },
    { eu: "33", uk: "1", us: "2Y", cm: "21.0" },
    { eu: "36", uk: "3", us: "4Y", cm: "22.6" },
    { eu: "39", uk: "5", us: "6Y", cm: "24.3" },
    { eu: "40", uk: "6", us: "7Y", cm: "25.2" },
  ],
};

export const BOB_SIZE_CHARTS = {
  men: BOB_MEN,
  women: BOB_WOMEN,
  kids: BOB_KIDS,
};

export const BOB_CHART_ORDER = ["men", "women", "kids"] as const;

// Real published size-conversion charts, sourced per brand (not
// generated/guessed) — see each section's comment for where the numbers
// came from. A brand with no real published chart for a given category is
// simply left out of that category's `brands` map rather than getting an
// invented one — the UI only lists brands that actually have data.

export type BrandKey =
  | "nike"
  | "adidas"
  | "asics"
  | "new-balance"
  | "premiata"
  | "off-white"
  | "salomon";

export const BRAND_LABELS: Record<BrandKey, string> = {
  nike: "Nike",
  adidas: "Adidas",
  asics: "Asics",
  "new-balance": "New Balance",
  premiata: "Premiata",
  "off-white": "Off-White",
  salomon: "Salomon",
};

export const BRAND_ORDER: BrandKey[] = [
  "nike",
  "adidas",
  "asics",
  "new-balance",
  "premiata",
  "off-white",
  "salomon",
];

export type FootwearSizeRow = {
  eu: string;
  uk: string;
  us: string;
  cm: string;
};
export type ClothingSizeRow = {
  size: string;
  eu: string;
  chestCm: string;
  waistCm: string;
};
export type CapSizeRow = { size: string; circumferenceCm: string };

export type FootwearChart = {
  label: string;
  rows: FootwearSizeRow[];
  note?: string;
};
export type ClothingChart = {
  label: string;
  rows: ClothingSizeRow[];
  note?: string;
};
export type CapChart = { label: string; rows: CapSizeRow[]; note?: string };

// ---------------------------------------------------------------------
// Men's footwear — source: outsole.nl brand comparison charts (Nike,
// Adidas, New Balance, Asics), footshop.eu official brand pages
// (Off-White, Salomon), premiata.it's own size-chart page (Premiata).
// ---------------------------------------------------------------------
export const MEN_FOOTWEAR: Partial<Record<BrandKey, FootwearChart>> = {
  nike: {
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
  },
  adidas: {
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
  },
  asics: {
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
  },
  "new-balance": {
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
  },
  premiata: {
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
  },
  "off-white": {
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
  },
  salomon: {
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
  },
};

// ---------------------------------------------------------------------
// Women's footwear — real per-brand data. A brand missing here has no
// real published women's-specific chart found (checked: Premiata,
// Off-White don't split UK/US or CM respectively — shown as "—" rather
// than guessed; not omitted, since the EU numbers they DO publish are
// real). Sources: nike.com (Nike), footshop.eu brand pages (Adidas,
// Asics, Salomon), sizefit.org + footshop.eu discrete points (New
// Balance — NB's own chart is published as bands, not per-size rows;
// only the confirmed discrete sizes are included here), premiata.it
// (Premiata, foot-length mm converted to cm).
// ---------------------------------------------------------------------
export const WOMEN_FOOTWEAR: Partial<Record<BrandKey, FootwearChart>> = {
  nike: {
    label: "Nike",
    rows: [
      { eu: "33.5", uk: "1.5", us: "3.5", cm: "21" },
      { eu: "34.5", uk: "1.5", us: "4", cm: "21" },
      { eu: "35", uk: "2", us: "4.5", cm: "21.5" },
      { eu: "35.5", uk: "2.5", us: "5", cm: "22" },
      { eu: "36", uk: "3", us: "5.5", cm: "22.5" },
      { eu: "36.5", uk: "3.5", us: "6", cm: "23" },
      { eu: "37.5", uk: "4", us: "6.5", cm: "23.5" },
      { eu: "38", uk: "4.5", us: "7", cm: "24" },
      { eu: "38.5", uk: "5", us: "7.5", cm: "24.5" },
      { eu: "39", uk: "5.5", us: "8", cm: "25" },
      { eu: "40", uk: "6", us: "8.5", cm: "25.5" },
      { eu: "40.5", uk: "6.5", us: "9", cm: "26" },
      { eu: "41", uk: "7", us: "9.5", cm: "26.5" },
      { eu: "42", uk: "7.5", us: "10", cm: "27" },
      { eu: "42.5", uk: "8", us: "10.5", cm: "27.5" },
      { eu: "43", uk: "8.5", us: "11", cm: "28" },
      { eu: "44", uk: "9", us: "11.5", cm: "28.5" },
      { eu: "44.5", uk: "9.5", us: "12", cm: "29" },
      { eu: "45", uk: "10", us: "12.5", cm: "29.5" },
      { eu: "45.5", uk: "10.5", us: "13", cm: "30" },
    ],
  },
  adidas: {
    label: "Adidas",
    rows: [
      { eu: "35", uk: "2.5", us: "4", cm: "21" },
      { eu: "35⅓", uk: "3", us: "4.5", cm: "21.5" },
      { eu: "36", uk: "3.5", us: "5", cm: "22.1" },
      { eu: "36⅔", uk: "4", us: "5.5", cm: "22.5" },
      { eu: "37⅓", uk: "4.5", us: "6", cm: "22.9" },
      { eu: "38", uk: "5", us: "6.5", cm: "23.3" },
      { eu: "38⅔", uk: "5.5", us: "7", cm: "23.8" },
      { eu: "39⅓", uk: "6", us: "7.5", cm: "24.2" },
      { eu: "40", uk: "6.5", us: "8", cm: "24.6" },
      { eu: "40⅔", uk: "7", us: "8.5", cm: "25" },
      { eu: "41⅓", uk: "7.5", us: "9", cm: "25.5" },
      { eu: "42", uk: "8", us: "9.5", cm: "25.9" },
      { eu: "42⅔", uk: "8.5", us: "10", cm: "26.3" },
      { eu: "43⅓", uk: "9", us: "10.5", cm: "26.7" },
      { eu: "44", uk: "9.5", us: "11", cm: "27.1" },
    ],
  },
  asics: {
    label: "Asics",
    rows: [
      { eu: "34.5", uk: "2", us: "4", cm: "21.5" },
      { eu: "35", uk: "2.5", us: "4.5", cm: "22" },
      { eu: "35.5", uk: "3", us: "5", cm: "22.5" },
      { eu: "36", uk: "3.5", us: "5.5", cm: "22.75" },
      { eu: "37", uk: "4", us: "6", cm: "23" },
      { eu: "37.5", uk: "4.5", us: "6.5", cm: "23.5" },
      { eu: "38", uk: "5", us: "7", cm: "24" },
      { eu: "39", uk: "5.5", us: "7.5", cm: "24.5" },
      { eu: "39.5", uk: "6", us: "8", cm: "25" },
      { eu: "40", uk: "6.5", us: "8.5", cm: "25.5" },
      { eu: "40.5", uk: "7", us: "9", cm: "25.75" },
      { eu: "41.5", uk: "7.5", us: "9.5", cm: "26" },
      { eu: "42", uk: "8", us: "10", cm: "26.5" },
      { eu: "42.5", uk: "8.5", us: "10.5", cm: "27" },
      { eu: "43.5", uk: "9", us: "11", cm: "27.5" },
    ],
  },
  "new-balance": {
    label: "New Balance",
    note: "New Balance публікує жіночу таблицю діапазонами розмірів, тому тут лише підтверджені окремі значення, а не повна сітка через кожні пів розміру.",
    rows: [
      { eu: "33", uk: "1", us: "3", cm: "20" },
      { eu: "40", uk: "6.5", us: "8.5", cm: "25.5" },
      { eu: "43", uk: "9", us: "11", cm: "28" },
      { eu: "44", uk: "10", us: "12", cm: "29" },
      { eu: "48", uk: "13", us: "15", cm: "32" },
    ],
  },
  premiata: {
    label: "Premiata",
    note: "Premiata публікує лише розмір EU та довжину стопи — офіційних відповідників UK/US бренд не вказує.",
    rows: [
      { eu: "35", uk: "—", us: "—", cm: "23.0" },
      { eu: "36", uk: "—", us: "—", cm: "23.6" },
      { eu: "37", uk: "—", us: "—", cm: "24.3" },
      { eu: "38", uk: "—", us: "—", cm: "25.0" },
      { eu: "39", uk: "—", us: "—", cm: "25.6" },
      { eu: "40", uk: "—", us: "—", cm: "26.3" },
      { eu: "41", uk: "—", us: "—", cm: "27.0" },
      { eu: "42", uk: "—", us: "—", cm: "27.6" },
    ],
  },
  "off-white": {
    label: "Off-White",
    note: "Off-White не публікує відповідник CM для жіночого взуття.",
    rows: [
      { eu: "34", uk: "1", us: "4", cm: "—" },
      { eu: "35", uk: "2", us: "5", cm: "—" },
      { eu: "36", uk: "3", us: "6", cm: "—" },
      { eu: "37", uk: "4", us: "7", cm: "—" },
      { eu: "38", uk: "5", us: "8", cm: "—" },
      { eu: "39", uk: "6", us: "9", cm: "—" },
      { eu: "40", uk: "7", us: "10", cm: "—" },
      { eu: "41", uk: "8", us: "11", cm: "—" },
      { eu: "42", uk: "9", us: "12", cm: "—" },
      { eu: "43", uk: "10", us: "13", cm: "—" },
      { eu: "44", uk: "11", us: "14", cm: "—" },
      { eu: "45", uk: "12", us: "15", cm: "—" },
      { eu: "46", uk: "13", us: "16", cm: "—" },
      { eu: "47", uk: "14", us: "17", cm: "—" },
    ],
  },
  salomon: {
    label: "Salomon",
    rows: [
      { eu: "36", uk: "3.5", us: "5", cm: "21.5" },
      { eu: "36⅔", uk: "4", us: "5.5", cm: "22" },
      { eu: "37⅓", uk: "4.5", us: "6", cm: "22.5" },
      { eu: "38", uk: "5", us: "6.5", cm: "23" },
      { eu: "38⅔", uk: "5.5", us: "7", cm: "23.5" },
      { eu: "39⅓", uk: "6", us: "7.5", cm: "24" },
      { eu: "40", uk: "6.5", us: "8", cm: "24.5" },
      { eu: "40⅔", uk: "7", us: "8.5", cm: "25" },
      { eu: "41⅓", uk: "7.5", us: "9", cm: "25.5" },
      { eu: "42", uk: "8", us: "9.5", cm: "26" },
      { eu: "42⅔", uk: "8.5", us: "10", cm: "26.5" },
      { eu: "43⅓", uk: "9", us: "10.5", cm: "27" },
      { eu: "44", uk: "9.5", us: "11", cm: "27.5" },
      { eu: "44⅔", uk: "10", us: "11.5", cm: "28" },
      { eu: "45⅓", uk: "10.5", us: "12", cm: "28.5" },
    ],
  },
};

// ---------------------------------------------------------------------
// Kids footwear — real per-brand data. Salomon has no real published
// kids chart (checked footshop.eu, which explicitly states it doesn't
// carry one) and Asics' own kids chart mixes two non-aligned numbering
// systems inconsistently across sources — both left out rather than
// publish something unreliable; ask to have either filled in properly
// later if needed. Sources: footshop.eu brand pages (Nike, Adidas,
// Off-White), sizefit.org + footshop.eu discrete points (New Balance —
// same "published as bands" situation as the women's chart), premiata.it
// (Premiata, foot-length cm).
// ---------------------------------------------------------------------
export const KIDS_FOOTWEAR: Partial<Record<BrandKey, FootwearChart>> = {
  nike: {
    label: "Nike",
    note: "Розміри для підлітків (US Y). Менші дитячі розміри (US C, немовлята/малюки) поки не додані — офіційне джерело дає дві розбіжні колонки CM для цього діапазону, тож ми не публікуємо їх, доки не звіримо вручну.",
    rows: [
      { eu: "32", uk: "13.5", us: "1Y", cm: "20" },
      { eu: "33", uk: "1", us: "1.5Y", cm: "20.5" },
      { eu: "33.5", uk: "1.5", us: "2Y", cm: "21" },
      { eu: "34", uk: "2", us: "2.5Y", cm: "21.5" },
      { eu: "35", uk: "2.5", us: "3Y", cm: "22" },
      { eu: "35.5", uk: "3", us: "3.5Y", cm: "22.5" },
      { eu: "36", uk: "3.5", us: "4Y", cm: "23" },
      { eu: "36.5", uk: "4", us: "4.5Y", cm: "23.5" },
      { eu: "37.5", uk: "4.5", us: "5Y", cm: "23.5" },
      { eu: "38", uk: "5", us: "5.5Y", cm: "24" },
      { eu: "38.5", uk: "5.5", us: "6Y", cm: "24" },
      { eu: "39", uk: "6", us: "6.5Y", cm: "24.5" },
      { eu: "40", uk: "6", us: "7Y", cm: "25" },
      { eu: "40.5", uk: "6.5", us: "7.5Y", cm: "25.5" },
      { eu: "41", uk: "7", us: "8Y", cm: "26" },
      { eu: "42", uk: "7.5", us: "8.5Y", cm: "26.5" },
      { eu: "42.5", uk: "8", us: "9Y", cm: "27" },
      { eu: "43", uk: "8.5", us: "9.5Y", cm: "27.5" },
      { eu: "44", uk: "9", us: "10Y", cm: "28" },
      { eu: "44.5", uk: "9.5", us: "10.5Y", cm: "28.5" },
    ],
  },
  adidas: {
    label: "Adidas",
    rows: [
      { eu: "17", uk: "1K", us: "1K", cm: "9" },
      { eu: "17.5", uk: "1.5K", us: "2K", cm: "9.5" },
      { eu: "18", uk: "2K", us: "2.5-3K", cm: "9.8-10" },
      { eu: "19", uk: "3K", us: "3.5-4K", cm: "10.6" },
      { eu: "20", uk: "4K", us: "4.5-5K", cm: "11.5-12" },
      { eu: "21", uk: "5K", us: "5.5K", cm: "12.3" },
      { eu: "22", uk: "5.5K", us: "6K", cm: "12.8" },
      { eu: "23", uk: "6K", us: "6.5K", cm: "13.2" },
      { eu: "23.5", uk: "6.5K", us: "7K", cm: "13.6" },
      { eu: "24", uk: "7K", us: "7.5K", cm: "14" },
      { eu: "25", uk: "7.5K", us: "8K", cm: "14.5" },
      { eu: "25.5", uk: "8K", us: "8.5K", cm: "14.9" },
      { eu: "26", uk: "8.5K", us: "9K", cm: "15.3" },
      { eu: "26.5", uk: "9K", us: "9.5K", cm: "15.7" },
      { eu: "27", uk: "9.5K", us: "10K", cm: "16.1" },
    ],
  },
  "new-balance": {
    label: "New Balance",
    note: "New Balance публікує дитячу таблицю діапазонами розмірів, тому тут лише підтверджені окремі значення.",
    rows: [
      { eu: "28", uk: "10", us: "10.5", cm: "16.5" },
      { eu: "35", uk: "2.5", us: "3", cm: "21" },
      { eu: "40", uk: "6.5", us: "7", cm: "25" },
    ],
  },
  premiata: {
    label: "Premiata",
    note: "Premiata публікує лише розмір EU та довжину стопи — офіційних відповідників UK/US бренд не вказує.",
    rows: [
      { eu: "20", uk: "—", us: "—", cm: "13.0" },
      { eu: "22", uk: "—", us: "—", cm: "14.5" },
      { eu: "24", uk: "—", us: "—", cm: "16.0" },
      { eu: "26", uk: "—", us: "—", cm: "17.0" },
      { eu: "28", uk: "—", us: "—", cm: "18.5" },
      { eu: "30", uk: "—", us: "—", cm: "20.0" },
      { eu: "32", uk: "—", us: "—", cm: "21.5" },
      { eu: "34", uk: "—", us: "—", cm: "23.0" },
      { eu: "36", uk: "—", us: "—", cm: "24.0" },
      { eu: "38", uk: "—", us: "—", cm: "25.0" },
      { eu: "40", uk: "—", us: "—", cm: "26.0" },
    ],
  },
  "off-white": {
    label: "Off-White",
    rows: [
      { eu: "16", uk: "0", us: "1", cm: "9.3" },
      { eu: "18", uk: "2", us: "3", cm: "11" },
      { eu: "20", uk: "4", us: "5", cm: "12.3" },
      { eu: "22", uk: "5", us: "6", cm: "13.7" },
      { eu: "24", uk: "7", us: "8", cm: "15" },
      { eu: "26", uk: "8.5", us: "9.5", cm: "16.3" },
      { eu: "28", uk: "10", us: "11", cm: "17.7" },
      { eu: "30", uk: "12", us: "13", cm: "19" },
      { eu: "32", uk: "13", us: "1", cm: "20.4" },
      { eu: "34", uk: "2", us: "3", cm: "21.7" },
      { eu: "36", uk: "3", us: "4", cm: "23" },
      { eu: "38", uk: "5", us: "6", cm: "24.3" },
      { eu: "40", uk: "7", us: "8", cm: "25.7" },
    ],
  },
};

// ---------------------------------------------------------------------
// Clothing (men's apparel — the primary line for all 7 brands). Off-White
// and Premiata don't publish a general chest/waist chart (Off-White
// communicates fit per-product via model measurements instead; Premiata's
// own size-chart page is shoes-only) — left out rather than guessed.
// EU sizes are only shown where a brand directly confirms them (Adidas
// confirms EU48=M/EU52=L on its own site) — left as "—" elsewhere rather
// than interpolating a EU number no brand actually published. Sources:
// nike.com/size-fit, adidas.com size chart (corroborated via a retailer
// reproducing identical numbers after adidas.com blocked direct fetch),
// asics.com size-fit guide (Western Fit), newbalance.com (corroborated
// via retailer, direct fetch blocked), salomon.com (corroborated via two
// independent retailer conversions, direct fetch blocked).
// ---------------------------------------------------------------------
export const CLOTHING: Partial<Record<BrandKey, ClothingChart>> = {
  nike: {
    label: "Nike",
    rows: [
      { size: "XXS", eu: "—", chestCm: "71-80", waistCm: "57-65" },
      { size: "XS", eu: "—", chestCm: "80-89", waistCm: "65-74" },
      { size: "S", eu: "—", chestCm: "89-95", waistCm: "74-81" },
      { size: "M", eu: "—", chestCm: "95-104", waistCm: "81-89" },
      { size: "L", eu: "—", chestCm: "104-112", waistCm: "89-97" },
      { size: "XL", eu: "—", chestCm: "112-123", waistCm: "97-109" },
      { size: "XXL", eu: "—", chestCm: "123-136", waistCm: "109-121" },
    ],
  },
  adidas: {
    label: "Adidas",
    note: "EU-розмір наведено лише там, де бренд прямо вказує відповідник; для решти розмірів adidas EU-номер не публікує.",
    rows: [
      { size: "XS", eu: "—", chestCm: "83-86", waistCm: "71-74" },
      { size: "S", eu: "—", chestCm: "87-92", waistCm: "75-80" },
      { size: "M", eu: "48", chestCm: "93-100", waistCm: "81-88" },
      { size: "L", eu: "52", chestCm: "101-108", waistCm: "89-96" },
      { size: "XL", eu: "—", chestCm: "109-118", waistCm: "97-106" },
    ],
  },
  asics: {
    label: "Asics",
    note: "За таблицею Western Fit офіційного сайту Asics.",
    rows: [
      { size: "XS", eu: "—", chestCm: "81-86", waistCm: "68-73" },
      { size: "S", eu: "—", chestCm: "86-91", waistCm: "73-78" },
      { size: "M", eu: "—", chestCm: "91-96", waistCm: "78-83" },
      { size: "L", eu: "—", chestCm: "96-103", waistCm: "83-90" },
      { size: "XL", eu: "—", chestCm: "103-114", waistCm: "90-101" },
      { size: "XXL", eu: "—", chestCm: "114-125", waistCm: "101-112" },
    ],
  },
  "new-balance": {
    label: "New Balance",
    note: "New Balance публікує лише обхват грудей — офіційних значень талії бренд не вказує.",
    rows: [
      { size: "S", eu: "—", chestCm: "94-99", waistCm: "—" },
      { size: "M", eu: "—", chestCm: "99-104", waistCm: "—" },
      { size: "L", eu: "—", chestCm: "104-109", waistCm: "—" },
      { size: "XL", eu: "—", chestCm: "110-118", waistCm: "—" },
      { size: "XXL", eu: "—", chestCm: "119-128", waistCm: "—" },
    ],
  },
  salomon: {
    label: "Salomon",
    note: "Дані за незалежними ретейлерами Salomon — офіційний сайт бренду публікує таблицю, але прямий доступ був заблокований; обхват талії бренд окремо не вказує.",
    rows: [
      { size: "XS", eu: "—", chestCm: "85-91", waistCm: "—" },
      { size: "S", eu: "—", chestCm: "91-97", waistCm: "—" },
      { size: "M", eu: "—", chestCm: "97-104", waistCm: "—" },
      { size: "L", eu: "—", chestCm: "104-109", waistCm: "—" },
      { size: "XL", eu: "—", chestCm: "109-118", waistCm: "—" },
    ],
  },
};

// ---------------------------------------------------------------------
// Caps / headwear. Asics, New Balance and Premiata don't publish a
// cap size chart (checked; likely because it's not a core product line
// for them) — left out rather than guessed. Off-White sells beanies as
// a real, confirmed "One Size" — shown with no cm figure since the
// brand doesn't publish one, rather than inventing a number. Sources:
// nike.com/size-fit (Nike), adidas.com size chart (Adidas, corroborated
// via retailer after direct fetch was blocked), off---white.com product
// pages (Off-White), a retailer republishing Salomon's own headwear
// sizing (Salomon — not confirmed directly on salomon.com).
// ---------------------------------------------------------------------
export const CAPS: Partial<Record<BrandKey, CapChart>> = {
  nike: {
    label: "Nike",
    rows: [
      { size: "Regulated (унісекс)", circumferenceCm: "54-61" },
      { size: "Swoosh Flex S/M", circumferenceCm: "55-58" },
      { size: "Swoosh Flex M/L", circumferenceCm: "57-60" },
      { size: "Swoosh Flex L/XL", circumferenceCm: "59-62" },
    ],
  },
  adidas: {
    label: "Adidas",
    rows: [
      { size: "S/M", circumferenceCm: "56-58" },
      { size: "M/L", circumferenceCm: "58-60" },
      { size: "L/XL", circumferenceCm: "60-62" },
    ],
  },
  "off-white": {
    label: "Off-White",
    note: "Off-White випускає шапки/кепки виключно в одному розмірі — офіційний обхват голови бренд не вказує.",
    rows: [{ size: "One Size", circumferenceCm: "—" }],
  },
  salomon: {
    label: "Salomon",
    note: "За даними офіційного ретейлера Salomon — прямого підтвердження на salomon.com не знайдено.",
    rows: [
      { size: "S/M", circumferenceCm: "54" },
      { size: "M/L", circumferenceCm: "56" },
      { size: "L/XL", circumferenceCm: "59" },
    ],
  },
};

// ---------------------------------------------------------------------
// BOB's own generic fallback charts — for any brand not in the specific
// category's list above. Source: sizefit.org's generic/standard men's
// chart (the only one found with half-sizes reaching EU 49.5-50) for
// Men; urbanstylefootwear.com's generic charts for Women and Kids.
// ---------------------------------------------------------------------
export const BOB_MEN_FOOTWEAR: FootwearChart = {
  label: "BOB — загальна таблиця",
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

export const BOB_WOMEN_FOOTWEAR: FootwearChart = {
  label: "BOB — загальна таблиця",
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

export const BOB_KIDS_FOOTWEAR: FootwearChart = {
  label: "BOB — загальна таблиця",
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

// ---------------------------------------------------------------------
// Top-level categories, in the order they render.
// ---------------------------------------------------------------------
export type SizeGuideCategory =
  | {
      key: string;
      label: string;
      kind: "footwear";
      brands: Partial<Record<BrandKey, FootwearChart>>;
      bobFallback: FootwearChart;
    }
  | {
      key: string;
      label: string;
      kind: "clothing";
      brands: Partial<Record<BrandKey, ClothingChart>>;
    }
  | {
      key: string;
      label: string;
      kind: "caps";
      brands: Partial<Record<BrandKey, CapChart>>;
    };

export const SIZE_GUIDE_CATEGORIES: SizeGuideCategory[] = [
  {
    key: "men-footwear",
    label: "Чоловіче взуття",
    kind: "footwear",
    brands: MEN_FOOTWEAR,
    bobFallback: BOB_MEN_FOOTWEAR,
  },
  {
    key: "women-footwear",
    label: "Жіноче взуття",
    kind: "footwear",
    brands: WOMEN_FOOTWEAR,
    bobFallback: BOB_WOMEN_FOOTWEAR,
  },
  {
    key: "kids-footwear",
    label: "Дитяче взуття",
    kind: "footwear",
    brands: KIDS_FOOTWEAR,
    bobFallback: BOB_KIDS_FOOTWEAR,
  },
  {
    key: "clothing",
    label: "Одяг",
    kind: "clothing",
    brands: CLOTHING,
  },
  {
    key: "caps",
    label: "Аксесуари (кепки)",
    kind: "caps",
    brands: CAPS,
  },
];

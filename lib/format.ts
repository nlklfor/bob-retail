// Comma thousand-separators for price display (e.g. 3999 -> "3,999"),
// independent of the site's Ukrainian locale text — this is purely a
// digit-grouping choice, not a translation.
export function formatPrice(price: number): string {
  return price.toLocaleString("en-US");
}

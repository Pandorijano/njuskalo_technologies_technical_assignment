/**
 * Methods used to get car year and milage from the filtered ads descriptions
 
/**
 * Convert a localized number string to a number.
 *
 * @param txt - Source text could contain different separators.
 * @returns Number or `undefined` if none found.
 *
 * @example
 * normalizeNumber('180 000 km'); // -> 180000
 * normalizeNumber('1.234,56 km'); // -> 123456 (decimals ignored)
 */
export const normalizeNumber = (txt: string): number | undefined => {
  const m = txt.replace(/\u00A0/g, ' ').match(/(\d[\d\s\.\,]*)/);
  if (!m) return undefined;
  const cleaned = m[1].replace(/[^\d]/g, '');
  return cleaned ? Number(cleaned) : undefined;
};

/**
 * Extract the first 4-digit year (1900–2099) from text.
 *
 * @param txt - Source text.
 * @returns Year as number, or `undefined` if not present.
 *
 * @example
 * extractYear('Audi A4, letnik 2018, 120k km'); // -> 2018
 */
export const extractYear = (txt: string): number | undefined => {
  const m = txt.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : undefined;
};

/**
 * Extract mileage in **kilometers** from text.
 *
 * @param txt - Source text.
 * @returns Mileage in km, or `undefined` if not found or "km" not present.
 *
 * @example
 * extractMileageKm('95.000 km'); // -> 95000
 * extractMileageKm('60,000 miles'); // -> undefined (expects "km")
 *
 * @remarks
 * Requires the presence of "km" (case-insensitive) to avoid picking unrelated numbers.
 */
export const extractMileageKm = (txt: string): number | undefined => {
  if (!/km/i.test(txt)) return undefined;
  return normalizeNumber(txt);
};

/**
 * Creates an object with year and milage values from the ad descriptions.
 * 
 * @param txt - Listing description text.
 * @returns Object with optional `year` and `mileageKm` fields.
 *
 * @example
 * fetchAdDescription('BMW 320d 2019, 120.000 km, odlično stanje');
 * // -> { year: 2019, mileageKm: 120000 }
 */
export const fetchAdDescription = (txt: string): { year?: number; mileageKm?: number } => ({
  year: extractYear(txt),
  mileageKm: extractMileageKm(txt),
});
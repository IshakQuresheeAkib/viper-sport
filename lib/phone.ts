/**
 * Normalise any accepted BD phone format to the canonical +880XXXXXXXXX form.
 * Accepts: 01XXXXXXXXX · 8801XXXXXXXXX · +8801XXXXXXXXX
 */
export function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  if (trimmed.startsWith("+880")) return trimmed;
  if (trimmed.startsWith("880")) return `+${trimmed}`;
  if (trimmed.startsWith("0")) return `+880${trimmed.slice(1)}`;
  return trimmed;
}

/**
 * All legacy stored formats that may represent the same BD mobile number.
 * Used for duplicate lookups before inserts canonicalise to +880…
 */
export function getPhoneLookupVariants(phone: string): string[] {
  const canonical = normalizePhone(phone);

  if (!canonical.startsWith("+880") || canonical.length !== 14) {
    return [phone.trim()];
  }

  const withoutCountryCode = canonical.slice(4);

  return [canonical, canonical.slice(1), `0${withoutCountryCode}`];
}

/**
 * Match a stored canonical phone against admin search input.
 * Accepts local (01…), country-code (880…), and +880… query formats.
 */
export function matchesPhoneSearch(
  storedPhone: string,
  query: string,
): boolean {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return false;
  }

  const loweredQuery = trimmedQuery.toLowerCase();
  const storedVariants = getPhoneLookupVariants(storedPhone);

  if (
    storedVariants.some((variant) =>
      variant.toLowerCase().includes(loweredQuery),
    )
  ) {
    return true;
  }

  const normalizedQuery = normalizePhone(trimmedQuery);
  if (
    storedVariants.some((variant) =>
      variant.toLowerCase().includes(normalizedQuery.toLowerCase()),
    )
  ) {
    return true;
  }

  const queryDigits = trimmedQuery.replace(/\D/g, "");
  if (!queryDigits) {
    return false;
  }

  const storedDigits = normalizePhone(storedPhone).replace(/\D/g, "");
  let comparableQueryDigits = queryDigits;

  if (queryDigits.startsWith("0")) {
    comparableQueryDigits = `880${queryDigits.slice(1)}`;
  } else if (!queryDigits.startsWith("880") && queryDigits.length <= 10) {
    comparableQueryDigits = `880${queryDigits}`;
  }

  return storedDigits.includes(comparableQueryDigits);
}

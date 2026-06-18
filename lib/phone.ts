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

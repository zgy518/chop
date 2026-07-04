import { saveLicense, hasValidLicense } from "./storage";

/**
 * License key validation.
 *
 * MVP uses a simple prefix-based check. Key format:
 *   CHOP-XXXX-XXXX-XXXX
 *
 * When LemonSqueezy/Paddle becomes available, replace with API validation.
 * For MVP, we validate against pre-defined valid prefixes.
 *
 * To generate a valid key for a customer, use any key starting with one of
 * the VALID_PREFIXES below. Example: CHOP-C8A1-D3F7-B5E9
 */

const VALID_PREFIXES = [
  "c8a1", "d3f7", "e5b9", "f2c4",
  "a6e2", "b1d8", "f9c3", "e4a7",
];

function isValidPattern(key: string): boolean {
  const clean = key.replace(/-/g, "").toLowerCase();
  for (const prefix of VALID_PREFIXES) {
    if (clean.startsWith(prefix)) return true;
  }
  return false;
}

function isValidFormat(key: string): boolean {
  return /^CHOP-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/i.test(key.trim());
}

export function validateLicenseKey(key: string): { valid: boolean; error?: string } {
  if (hasValidLicense()) {
    return { valid: false, error: "A license is already activated on this device." };
  }

  if (!key || !key.trim()) {
    return { valid: false, error: "Please enter a license key." };
  }

  if (!isValidFormat(key.trim())) {
    return {
      valid: false,
      error: "Invalid format. Key should be: CHOP-XXXX-XXXX-XXXX",
    };
  }

  if (!isValidPattern(key.trim())) {
    return { valid: false, error: "Invalid license key. Please check and try again." };
  }

  // Valid! Save it
  saveLicense(key.trim().toUpperCase());
  return { valid: true };
}

/**
 * Generate a single valid license key for a paying customer.
 */
export function generateLicenseKey(): string {
  const prefix = VALID_PREFIXES[Math.floor(Math.random() * VALID_PREFIXES.length)];
  const segment = (): string =>
    Math.random().toString(36).slice(2, 6).toUpperCase();
  const suffix = segment() + segment() + segment();
  return `CHOP-${(prefix + suffix).slice(0, 4).toUpperCase()}-${segment()}-${segment()}`;
}

/**
 * Pre-made valid keys you can give to paying customers.
 */
export const MANUAL_KEYS: string[] = [
  "CHOP-C8A1-D3F7-B5E9",
  "CHOP-D3F7-A6E2-C1D8",
  "CHOP-E5B9-F2C4-A8D1",
  "CHOP-F2C4-E5B9-D7A3",
  "CHOP-A6E2-B1D8-F9C4",
];

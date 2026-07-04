const DAILY_LIMIT = 10;

interface UsageData {
  date: string; // YYYY-MM-DD
  count: number;
}

interface LicenseData {
  key: string;
  activatedAt: string;
}

const STORAGE_KEYS = {
  usage: "chop_usage",
  license: "chop_license",
} as const;

function getToday(): string {
  return new Date().toISOString().slice(0, 10);
}

// ── Usage tracking ──

export function getUsage(): UsageData {
  if (typeof window === "undefined") return { date: getToday(), count: 0 };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.usage);
    if (!raw) return { date: getToday(), count: 0 };

    const data: UsageData = JSON.parse(raw);
    // Reset count if it's a new day
    if (data.date !== getToday()) {
      return { date: getToday(), count: 0 };
    }
    return data;
  } catch {
    return { date: getToday(), count: 0 };
  }
}

export function incrementUsage(): UsageData {
  const current = getUsage();
  const updated: UsageData = {
    date: getToday(),
    count: current.count + 1,
  };
  try {
    localStorage.setItem(STORAGE_KEYS.usage, JSON.stringify(updated));
  } catch {
    // Storage full or unavailable — silently fail
  }
  return updated;
}

export function getRemainingFree(): number {
  return Math.max(0, DAILY_LIMIT - getUsage().count);
}

export function isFreeLimitReached(): boolean {
  return getRemainingFree() <= 0 && !hasValidLicense();
}

export const DAILY_LIMIT_COUNT = DAILY_LIMIT;

// ── License management ──

export function getLicense(): LicenseData | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.license);
    if (!raw) return null;
    return JSON.parse(raw) as LicenseData;
  } catch {
    return null;
  }
}

export function saveLicense(key: string): void {
  const data: LicenseData = {
    key,
    activatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.license, JSON.stringify(data));
}

export function hasValidLicense(): boolean {
  return getLicense() !== null;
}

export function clearLicense(): void {
  localStorage.removeItem(STORAGE_KEYS.license);
}

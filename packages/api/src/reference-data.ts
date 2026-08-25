import nigeriaStatesFallback from "./mock/nigeria-states.json";

export const MIN_STUDENT_AGE_YEARS = 15;

export interface BirthYearOption {
  value: string;
  label: string;
}

export interface NigeriaStateOption {
  value: string;
  label: string;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function extractRows(payload: unknown): unknown[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  if (Array.isArray(root)) return root;
  if (Array.isArray(root.data)) return root.data;
  if (root.data && typeof root.data === "object") {
    const data = root.data as Record<string, unknown>;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.states)) return data.states;
    if (Array.isArray(data.years)) return data.years;
  }
  if (Array.isArray(root.items)) return root.items;
  if (Array.isArray(root.states)) return root.states;
  if (Array.isArray(root.years)) return root.years;
  return [];
}

export function buildBirthYearOptions(
  minAgeYears = MIN_STUDENT_AGE_YEARS,
  maxAgeYears = 100,
): BirthYearOption[] {
  const currentYear = new Date().getFullYear();
  const oldestYear = currentYear - maxAgeYears;
  const youngestYear = currentYear - minAgeYears;
  const years: BirthYearOption[] = [];

  for (let year = youngestYear; year >= oldestYear; year -= 1) {
    const value = String(year);
    years.push({ value, label: value });
  }

  return years;
}

function normalizeYearRows(payload: unknown): BirthYearOption[] {
  const rows = extractRows(payload);
  const years: BirthYearOption[] = [];

  for (const row of rows) {
    if (typeof row === "number" && Number.isFinite(row)) {
      const value = String(row);
      years.push({ value, label: value });
      continue;
    }
    if (typeof row === "string" && row.trim()) {
      const value = row.trim();
      years.push({ value, label: value });
      continue;
    }
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const value = readString(record.value ?? record.year ?? record.label);
    if (!value) continue;
    years.push({ value, label: readString(record.label) || value });
  }

  return years;
}

function normalizeStateRows(payload: unknown): NigeriaStateOption[] {
  const rows = extractRows(payload);
  const states: NigeriaStateOption[] = [];

  for (const row of rows) {
    if (typeof row === "string" && row.trim()) {
      const value = row.trim();
      states.push({ value, label: value });
      continue;
    }
    if (!row || typeof row !== "object") continue;
    const record = row as Record<string, unknown>;
    const value = readString(record.value ?? record.name ?? record.state);
    if (!value) continue;
    states.push({ value, label: readString(record.label) || value });
  }

  return states;
}

export function fallbackStates(): NigeriaStateOption[] {
  return (nigeriaStatesFallback as string[]).map((name) => ({
    value: name,
    label: name,
  }));
}

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    "https://base-api.skillscaleup.org"
  );
}

export async function fetchBirthYearsFromApi(
  apiBaseUrl: string,
): Promise<BirthYearOption[]> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/api/v1/years`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return [];

  const normalized = normalizeYearRows(payload);
  return normalized.length > 0 ? normalized : [];
}

export async function fetchNigeriaStatesFromApi(
  apiBaseUrl: string,
): Promise<NigeriaStateOption[]> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/api/v1/states`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return [];

  const normalized = normalizeStateRows(payload);
  return normalized.length > 0 ? normalized : [];
}

export const referenceDataApi = {
  async listBirthYears(): Promise<BirthYearOption[]> {
    const response = await fetch("/api/years", { credentials: "include" });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
          ? (data as { message: string }).message
          : "Failed to load birth years";
      throw new Error(message);
    }

    const years = normalizeYearRows(data);
    return years.length > 0 ? years : buildBirthYearOptions();
  },

  async listNigeriaStates(): Promise<NigeriaStateOption[]> {
    const response = await fetch("/api/states", { credentials: "include" });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
          ? (data as { message: string }).message
          : "Failed to load states";
      throw new Error(message);
    }

    const states = normalizeStateRows(data);
    return states.length > 0 ? states : fallbackStates();
  },
};

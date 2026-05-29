import type { AvailableProgram } from "@ssu/types";

function readNumber(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return 0;
}

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function extractProgramRows(payload: unknown): unknown[] {
  if (!payload || typeof payload !== "object") return [];

  const root = payload as Record<string, unknown>;

  if (Array.isArray(root)) return root;

  const data = root.data;
  if (Array.isArray(data)) return data;

  if (data && typeof data === "object") {
    const dataObj = data as Record<string, unknown>;
    if (Array.isArray(dataObj.items)) return dataObj.items;
    if (Array.isArray(dataObj.programs)) return dataObj.programs;
  }

  if (Array.isArray(root.programs)) return root.programs;
  if (Array.isArray(root.items)) return root.items;

  return [];
}

export function normalizeAvailablePrograms(
  payload: unknown,
): AvailableProgram[] {
  const list = extractProgramRows(payload);
  const programs: AvailableProgram[] = [];

  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;

    const id = readString(row.id ?? row.programId ?? row.program_id ?? row._id);
    const name = readString(
      row.title ?? row.name ?? row.program_name ?? row.label,
    );
    if (!id || !name) continue;

    const fee = readNumber(
      row.priceAmount ??
        row.application_fee ??
        row.applicationFee ??
        row.fee ??
        row.tuition_fee ??
        row.price,
    );

    const cohortId =
      readString(row.cohortCode ?? row.cohortId ?? row.cohort_id) || undefined;
    const slug = readString(row.slug) || undefined;

    programs.push({
      id,
      name,
      applicationFee: fee,
      cohortId,
      slug,
    });
  }

  return programs;
}

export function resolveProgramIdentifier(
  programValue: string,
  programs: AvailableProgram[],
): string {
  const trimmed = programValue.trim();
  if (!trimmed) return trimmed;

  const needle = trimmed.toLowerCase();

  const match = programs.find((p) => {
    const name = p.name.toLowerCase();
    return (
      p.id === trimmed ||
      p.cohortId === trimmed ||
      p.slug === trimmed ||
      name === needle ||
      name.includes(needle) ||
      needle.includes(name)
    );
  });

  if (match) {
    return match.id;
  }

  return trimmed;
}

export async function fetchAvailablePrograms(
  apiBaseUrl: string,
): Promise<AvailableProgram[]> {
  const base = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${base}/api/v1/programs/available`, {
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) return [];

  return normalizeAvailablePrograms(payload);
}

export const programsApi = {
  async listAvailable(): Promise<AvailableProgram[]> {
    const response = await fetch("/api/programs/available", {
      credentials: "include",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        typeof data === "object" &&
        data !== null &&
        "message" in data &&
        typeof (data as { message: unknown }).message === "string"
          ? (data as { message: string }).message
          : "Failed to load programs";
      throw new Error(message);
    }

    return normalizeAvailablePrograms(data);
  },
};

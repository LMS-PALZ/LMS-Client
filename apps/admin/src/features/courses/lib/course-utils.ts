import type { CourseDraft } from "../types";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDateDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function parseDDMMYYYY(value: string): Date | null {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]) - 1;
  const year = Number(match[3]);
  const date = new Date(year, month, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return `${formatDateDDMMYYYY(start)} — ${formatDateDDMMYYYY(end)}`;
}

export function calculateDurationLabel(start: Date, end: Date): string {
  if (end < start) return "Invalid range";

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const remainderDays = end.getDate() - start.getDate();
  const months = remainderDays < 0 ? Math.max(totalMonths - 1, 0) : totalMonths;

  if (months <= 0) {
    const diffMs = end.getTime() - start.getTime();
    const days = Math.max(Math.round(diffMs / (1000 * 60 * 60 * 24)), 1);
    return days === 1 ? "1 day" : `${days} days`;
  }

  return months === 1 ? "1 month" : `${months} months`;
}

export function countCohortsInYear(
  cohorts: { startDate: string }[],
  year: number,
): number {
  return cohorts.filter((cohort) => {
    const startYear = new Date(cohort.startDate).getFullYear();
    return startYear === year;
  }).length;
}

export function formatCourseStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function formatPriceDisplay(value: string): string {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  return `NGN ${Number(digits).toLocaleString("en-NG")}`;
}

export function hasValidPrice(price: string): boolean {
  const digits = price.replace(/[^\d]/g, "");
  return digits.length > 0 && Number(digits) > 0;
}

export function parsePriceAmount(price: string): number {
  const digits = price.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function hasValidCapacity(capacity: string): boolean {
  const digits = capacity.replace(/[^\d]/g, "");
  return digits.length > 0 && Number(digits) > 0;
}

export function parseCapacityValue(capacity: string): number {
  const digits = capacity.replace(/[^\d]/g, "");
  return digits ? Number(digits) : 0;
}

export function isBasicStepComplete(draft: CourseDraft): boolean {
  return (
    draft.name.trim().length > 0 &&
    draft.description.trim().length > 0 &&
    hasValidPrice(draft.price) &&
    hasValidCapacity(draft.capacity)
  );
}

export function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export { MONTH_NAMES };

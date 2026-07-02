import type { CourseDraft, CourseStatus } from "../types";
import { formatDateDDMMYYYY } from "@ssu/utils";

export { formatDateDDMMYYYY };

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

export function normalizeCourseStatus(status: string): CourseStatus {
  return status === "published" ? "published" : "draft";
}

export function formatCourseListDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

export function parseTimeHHMM(
  value: string,
): { hours: number; minutes: number } | null {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return { hours, minutes };
}

export function formatTimeHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function combineDateAndTime(
  date: Date,
  time: string,
): string | undefined {
  const parsed = parseTimeHHMM(time);
  if (!parsed) return undefined;
  const combined = new Date(date);
  combined.setHours(parsed.hours, parsed.minutes, 0, 0);
  return combined.toISOString();
}

export function splitStartsAt(value?: string): {
  date: string;
  time: string;
} {
  if (!value) return { date: "", time: "" };
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return { date: "", time: "" };
  return {
    date: formatDateDDMMYYYY(parsed),
    time: formatTimeHHMM(parsed),
  };
}

import { MIN_STUDENT_AGE_YEARS } from "@ssu/api";

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
] as const;

export const MIN_AGE_ERROR_MESSAGE =
  "You are not up to the required age to register. You must be at least 15 years old.";

export function parseDateOfBirth(
  day: string,
  month: string,
  year: string,
): Date | null {
  const dayNum = Number.parseInt(day, 10);
  const yearNum = Number.parseInt(year, 10);
  const monthIndex = MONTH_NAMES.indexOf(month as (typeof MONTH_NAMES)[number]);

  if (
    !Number.isFinite(dayNum) ||
    !Number.isFinite(yearNum) ||
    monthIndex < 0 ||
    dayNum < 1 ||
    dayNum > 31
  ) {
    return null;
  }

  const date = new Date(yearNum, monthIndex, dayNum);
  if (
    date.getFullYear() !== yearNum ||
    date.getMonth() !== monthIndex ||
    date.getDate() !== dayNum
  ) {
    return null;
  }

  return date;
}

export function getAgeFromDateOfBirth(
  birthDate: Date,
  today = new Date(),
): number {
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }
  return age;
}

export function getAgeFromParts(
  day: string,
  month: string,
  year: string,
  today = new Date(),
): number | null {
  const birthDate = parseDateOfBirth(day, month, year);
  if (!birthDate) return null;
  return getAgeFromDateOfBirth(birthDate, today);
}

export function meetsMinimumAge(
  day: string,
  month: string,
  year: string,
  minAge = MIN_STUDENT_AGE_YEARS,
): boolean {
  const age = getAgeFromParts(day, month, year);
  if (age === null) return false;
  return age >= minAge;
}

export function isCompleteDateOfBirth(
  day: string,
  month: string,
  year: string,
): boolean {
  return Boolean(day.trim() && month.trim() && year.trim());
}

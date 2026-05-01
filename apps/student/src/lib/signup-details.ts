import type { SignUpFormValues } from "@ssu/schema";

export const STUDENT_SIGNUP_DETAILS_STORAGE_KEY = "ssu_student_signup_details";

export type StudentSignupDetails = SignUpFormValues;

export function readStudentSignupDetails(): StudentSignupDetails | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STUDENT_SIGNUP_DETAILS_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as StudentSignupDetails;
  } catch {
    return null;
  }
}

export function writeStudentSignupDetails(details: StudentSignupDetails): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    STUDENT_SIGNUP_DETAILS_STORAGE_KEY,
    JSON.stringify(details),
  );
}


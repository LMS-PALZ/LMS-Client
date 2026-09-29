import type { SignUpFormValues } from "@ssu/schema";
import { useSignupStore } from "@ssu/store";
import {
  clearStudentSignupDetails,
  readStudentSignupDetails,
  writeStudentSignupDetails,
} from "@/lib/signup-details";

export const PAYMENT_RESUME_STORAGE_KEY = "ssu_payment_resume";

export type SignupSessionIdentity = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  program: string;
  program_title: string;
  programId?: string;
  programSlug?: string;
  applicationFee?: number;
};

function trim(value: string | undefined | null): string {
  if (typeof value !== "string") return "";
  const next = value.trim();
  if (!next || next === "undefined" || next === "null") return "";
  return next;
}

function readPaymentResume(): SignupSessionIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PAYMENT_RESUME_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SignupSessionIdentity>;
    const email = trim(parsed.email);
    const program = trim(parsed.program);
    if (!email && !program) return null;
    return {
      id: trim(parsed.id),
      email,
      first_name: trim(parsed.first_name),
      last_name: trim(parsed.last_name),
      phone_number: trim(parsed.phone_number),
      program,
      program_title: trim(parsed.program_title),
      programId: trim(parsed.programId) || undefined,
      programSlug: trim(parsed.programSlug) || program || undefined,
      applicationFee:
        typeof parsed.applicationFee === "number"
          ? parsed.applicationFee
          : undefined,
    };
  } catch {
    return null;
  }
}

function buildIdentity(): SignupSessionIdentity | null {
  const user = useSignupStore.getState().user;
  const details = readStudentSignupDetails();
  const resume = readPaymentResume();

  const email =
    trim(user?.email) || trim(details?.email) || trim(resume?.email);
  const first_name =
    trim(user?.first_name) ||
    trim(details?.first_name) ||
    trim(resume?.first_name);
  const last_name =
    trim(user?.last_name) ||
    trim(details?.last_name) ||
    trim(resume?.last_name);
  const phone_number =
    trim(user?.phone_number) ||
    trim(details?.phone_number) ||
    trim(resume?.phone_number);
  const program =
    trim(user?.program) || trim(details?.program) || trim(resume?.program);
  const program_title =
    trim(user?.program_title) ||
    trim(details?.programName) ||
    trim(resume?.program_title);

  if (!email && !first_name && !phone_number && !program) {
    return null;
  }

  return {
    id: trim(user?.id) || trim(resume?.id),
    email,
    first_name,
    last_name,
    phone_number,
    program,
    program_title,
    programId: trim(user?.programId) || trim(resume?.programId) || undefined,
    programSlug:
      trim(user?.programSlug) ||
      trim(resume?.programSlug) ||
      program ||
      undefined,
    applicationFee: details?.applicationFee ?? resume?.applicationFee,
  };
}

function storeMatchesIdentity(identity: SignupSessionIdentity): boolean {
  const user = useSignupStore.getState().user;
  return (
    trim(user?.email) === identity.email &&
    trim(user?.first_name) === identity.first_name &&
    trim(user?.last_name) === identity.last_name &&
    trim(user?.phone_number) === identity.phone_number &&
    trim(user?.program) === identity.program &&
    trim(user?.program_title) === identity.program_title
  );
}

function writeIdentity(identity: SignupSessionIdentity): void {
  writeStudentSignupDetails({
    first_name: identity.first_name,
    last_name: identity.last_name,
    email: identity.email,
    phone_number: identity.phone_number,
    program: identity.program,
    programName: identity.program_title || undefined,
    applicationFee: identity.applicationFee,
  });

  if (storeMatchesIdentity(identity)) return;

  useSignupStore.getState().setUser({
    id: identity.id,
    email: identity.email,
    role: "student",
    first_name: identity.first_name,
    last_name: identity.last_name,
    phone_number: identity.phone_number,
    program: identity.program,
    program_title: identity.program_title,
    programId: identity.programId,
    programSlug: identity.programSlug,
  });
}

/** Persist form + zustand so Korapay round-trips can remount paymentdetail safely. */
export function persistSignupSession(input: {
  values: SignUpFormValues;
  programName?: string;
  applicationFee?: number;
  id?: string;
  programId?: string;
}): SignupSessionIdentity {
  const identity: SignupSessionIdentity = {
    id: trim(input.id),
    email: trim(input.values.email).toLowerCase(),
    first_name: trim(input.values.first_name),
    last_name: trim(input.values.last_name),
    phone_number: trim(input.values.phone_number),
    program: trim(input.values.program),
    program_title: trim(input.programName),
    programId: trim(input.programId) || undefined,
    programSlug: trim(input.values.program) || undefined,
    applicationFee: input.applicationFee,
  };

  writeIdentity(identity);
  return identity;
}

/** Snapshot used when leaving for Korapay so return can restore even if zustand is empty. */
export function storePaymentResume(
  identity: SignupSessionIdentity,
  reference?: string,
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    PAYMENT_RESUME_STORAGE_KEY,
    JSON.stringify({
      ...identity,
      reference: reference ?? "",
      savedAt: Date.now(),
    }),
  );
  writeStudentSignupDetails({
    first_name: identity.first_name,
    last_name: identity.last_name,
    email: identity.email,
    phone_number: identity.phone_number,
    program: identity.program,
    programName: identity.program_title || undefined,
    applicationFee: identity.applicationFee,
  });
}

/** Read-only merge of zustand + localStorage snapshot. Does not write. */
export function resolveSignupSession(): SignupSessionIdentity | null {
  return buildIdentity();
}

/**
 * Restore identity into zustand/localStorage when incomplete.
 * Safe in effects — only calls setUser when store values actually differ.
 */
export function ensureSignupSessionPersisted(): SignupSessionIdentity | null {
  const identity = buildIdentity();
  if (!identity) return null;

  writeStudentSignupDetails({
    first_name: identity.first_name,
    last_name: identity.last_name,
    email: identity.email,
    phone_number: identity.phone_number,
    program: identity.program,
    programName: identity.program_title || undefined,
    applicationFee: identity.applicationFee,
  });

  if (!storeMatchesIdentity(identity) && (identity.email || identity.program)) {
    useSignupStore.getState().setUser({
      id: identity.id,
      email: identity.email,
      role: "student",
      first_name: identity.first_name,
      last_name: identity.last_name,
      phone_number: identity.phone_number,
      program: identity.program,
      program_title: identity.program_title,
      programId: identity.programId,
      programSlug: identity.programSlug,
    });
  }

  return identity;
}

export function clearSignupSession(): void {
  clearStudentSignupDetails();
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(PAYMENT_RESUME_STORAGE_KEY);
  }
  useSignupStore.getState().clearUser();
}

export function hasCompleteSignupSession(
  identity: SignupSessionIdentity | null | undefined,
): boolean {
  if (!identity) return false;
  return Boolean(
    identity.email &&
    identity.first_name &&
    identity.last_name &&
    identity.phone_number &&
    identity.program,
  );
}

export function formatSignupDisplayName(
  identity: Pick<SignupSessionIdentity, "first_name" | "last_name"> | null,
): string {
  if (!identity) return "";
  return [identity.first_name, identity.last_name].filter(Boolean).join(" ");
}

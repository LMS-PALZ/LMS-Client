import type { SignUpFormValues } from "@ssu/schema";
import { useSignupStore } from "@ssu/store";
import {
  clearStudentSignupDetails,
  readStudentSignupDetails,
  writeStudentSignupDetails,
} from "@/lib/signup-details";

export const PAYMENT_RESUME_STORAGE_KEY = "ssu_payment_resume";
export const PAYMENT_RESUME_COOKIE = "ssu_payment_resume";
export const PAYMENT_RESUME_QUERY = "resume";

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

type ResumePayload = {
  e: string;
  f: string;
  l: string;
  p: string;
  g: string;
  t: string;
  i?: string;
  a?: number;
  pid?: string;
};

function trim(value: string | undefined | null): string {
  if (typeof value !== "string") return "";
  const next = value.trim();
  if (!next || next === "undefined" || next === "null") return "";
  return next;
}

function toPayload(identity: SignupSessionIdentity): ResumePayload {
  return {
    e: identity.email,
    f: identity.first_name,
    l: identity.last_name,
    p: identity.phone_number,
    g: identity.program,
    t: identity.program_title,
    i: identity.id || undefined,
    a: identity.applicationFee,
    pid: identity.programId,
  };
}

function fromPayload(
  parsed: Partial<ResumePayload>,
): SignupSessionIdentity | null {
  const email = trim(parsed.e);
  const program = trim(parsed.g);
  if (!email && !program) return null;

  return {
    id: trim(parsed.i),
    email,
    first_name: trim(parsed.f),
    last_name: trim(parsed.l),
    phone_number: trim(parsed.p),
    program,
    program_title: trim(parsed.t),
    programId: trim(parsed.pid) || undefined,
    programSlug: program || undefined,
    applicationFee: typeof parsed.a === "number" ? parsed.a : undefined,
  };
}

/** Compact, URL-safe token so Korapay return can restore identity without localStorage. */
export function encodeSignupResume(identity: SignupSessionIdentity): string {
  const json = JSON.stringify(toPayload(identity));
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function decodeSignupResume(
  token: string | null | undefined,
): SignupSessionIdentity | null {
  if (!token) return null;
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const pad =
      padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
    const binary = atob(padded + pad);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return fromPayload(JSON.parse(json) as Partial<ResumePayload>);
  } catch {
    return null;
  }
}

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split("; ");
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    if (part.slice(0, idx) === name) {
      return decodeURIComponent(part.slice(idx + 1));
    }
  }
  return null;
}

function writeResumeCookie(token: string): void {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  // Lax survives top-level returns from Korapay; 2h covers abandoned checkouts.
  document.cookie = `${PAYMENT_RESUME_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=7200; SameSite=Lax${secure}`;
}

function clearResumeCookie(): void {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; Secure"
      : "";
  document.cookie = `${PAYMENT_RESUME_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

function readPaymentResumeStorage(): SignupSessionIdentity | null {
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

function buildIdentity(
  urlIdentity?: SignupSessionIdentity | null,
): SignupSessionIdentity | null {
  const user = useSignupStore.getState().user;
  const details = readStudentSignupDetails();
  const resume = readPaymentResumeStorage();
  const cookieIdentity = decodeSignupResume(readCookie(PAYMENT_RESUME_COOKIE));

  const email =
    trim(urlIdentity?.email) ||
    trim(user?.email) ||
    trim(details?.email) ||
    trim(resume?.email) ||
    trim(cookieIdentity?.email);
  const first_name =
    trim(urlIdentity?.first_name) ||
    trim(user?.first_name) ||
    trim(details?.first_name) ||
    trim(resume?.first_name) ||
    trim(cookieIdentity?.first_name);
  const last_name =
    trim(urlIdentity?.last_name) ||
    trim(user?.last_name) ||
    trim(details?.last_name) ||
    trim(resume?.last_name) ||
    trim(cookieIdentity?.last_name);
  const phone_number =
    trim(urlIdentity?.phone_number) ||
    trim(user?.phone_number) ||
    trim(details?.phone_number) ||
    trim(resume?.phone_number) ||
    trim(cookieIdentity?.phone_number);
  const program =
    trim(urlIdentity?.program) ||
    trim(user?.program) ||
    trim(details?.program) ||
    trim(resume?.program) ||
    trim(cookieIdentity?.program);
  const program_title =
    trim(urlIdentity?.program_title) ||
    trim(user?.program_title) ||
    trim(details?.programName) ||
    trim(resume?.program_title) ||
    trim(cookieIdentity?.program_title);

  if (!email && !first_name && !phone_number && !program) {
    return null;
  }

  return {
    id:
      trim(urlIdentity?.id) ||
      trim(user?.id) ||
      trim(resume?.id) ||
      trim(cookieIdentity?.id),
    email,
    first_name,
    last_name,
    phone_number,
    program,
    program_title,
    programId:
      trim(urlIdentity?.programId) ||
      trim(user?.programId) ||
      trim(resume?.programId) ||
      trim(cookieIdentity?.programId) ||
      undefined,
    programSlug:
      trim(urlIdentity?.programSlug) ||
      trim(user?.programSlug) ||
      trim(resume?.programSlug) ||
      trim(cookieIdentity?.programSlug) ||
      program ||
      undefined,
    applicationFee:
      urlIdentity?.applicationFee ??
      details?.applicationFee ??
      resume?.applicationFee ??
      cookieIdentity?.applicationFee,
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
  storePaymentResume(identity);
  return identity;
}

/** Snapshot used when leaving for Korapay (localStorage + cookie). */
export function storePaymentResume(
  identity: SignupSessionIdentity,
  reference?: string,
): void {
  if (typeof window === "undefined") return;

  const token = encodeSignupResume(identity);
  window.localStorage.setItem(
    PAYMENT_RESUME_STORAGE_KEY,
    JSON.stringify({
      ...identity,
      reference: reference ?? "",
      savedAt: Date.now(),
    }),
  );
  writeResumeCookie(token);
  writeStudentSignupDetails({
    first_name: identity.first_name,
    last_name: identity.last_name,
    email: identity.email,
    phone_number: identity.phone_number,
    program: identity.program,
    programName: identity.program_title || undefined,
    applicationFee: identity.applicationFee,
  });
  writeIdentity(identity);
}

export function buildPaymentVerifyCallbackUrl(
  origin: string,
  identity: SignupSessionIdentity,
): string {
  const token = encodeSignupResume(identity);
  const url = new URL("/verifypayment", origin);
  url.searchParams.set(PAYMENT_RESUME_QUERY, token);
  return url.toString();
}

export function paymentDetailPath(
  identity?: SignupSessionIdentity | null,
): string {
  if (!identity || (!identity.email && !identity.program)) {
    return "/paymentdetail";
  }
  const token = encodeSignupResume(identity);
  return `/paymentdetail?${PAYMENT_RESUME_QUERY}=${encodeURIComponent(token)}`;
}

/** Apply a resume token from the URL (Korapay / verify redirect). */
export function applySignupResumeToken(
  token: string | null | undefined,
): SignupSessionIdentity | null {
  const fromUrl = decodeSignupResume(token);
  if (fromUrl) {
    storePaymentResume(fromUrl);
  }
  return ensureSignupSessionPersisted(fromUrl);
}

/** Read-only merge. Does not write. */
export function resolveSignupSession(
  urlIdentity?: SignupSessionIdentity | null,
): SignupSessionIdentity | null {
  return buildIdentity(urlIdentity);
}

/**
 * Restore identity into zustand/localStorage/cookie.
 * Safe in effects — only calls setUser when store values actually differ.
 */
export function ensureSignupSessionPersisted(
  urlIdentity?: SignupSessionIdentity | null,
): SignupSessionIdentity | null {
  const identity = buildIdentity(urlIdentity);
  if (!identity) return null;

  storePaymentResume(identity);
  return identity;
}

export function clearSignupSession(): void {
  clearStudentSignupDetails();
  clearResumeCookie();
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

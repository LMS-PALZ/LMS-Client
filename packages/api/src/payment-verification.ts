export const PAYMENT_REFERENCE_STORAGE_KEY = "payment_reference";

export type PaymentGatewayStatus = "pending" | "successful" | "failed";
export type PaymentFulfillmentStatus = "pending" | "completed" | "failed";

export interface PaymentVerificationStudent {
  id?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  program?: string;
  program_title?: string;
  programId?: string;
  programSlug?: string;
  applicationFee?: number;
}

export interface PaymentVerificationData {
  reference: string;
  paymentStatus: PaymentGatewayStatus;
  fulfillmentStatus: PaymentFulfillmentStatus;
  failureReason?: string;
  applicationStatus?: string;
  message?: string;
  student?: PaymentVerificationStudent;
}

function readString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function readNumber(...values: unknown[]): number | undefined {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return undefined;
}

function readStudentRecord(
  row: Record<string, unknown>,
): Record<string, unknown> | null {
  for (const key of ["student", "applicant", "user", "customer"] as const) {
    const value = row[key];
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
  }
  return null;
}

function normalizeStudent(
  row: Record<string, unknown>,
): PaymentVerificationStudent | undefined {
  const nested = readStudentRecord(row);
  const source = nested ?? row;

  const email = readString(source.email, source.Email);
  const first_name = readString(
    source.first_name,
    source.firstName,
    source.firstname,
  );
  const last_name = readString(
    source.last_name,
    source.lastName,
    source.lastname,
  );
  const phone_number = readString(
    source.phone_number,
    source.phoneNumber,
    source.phone,
  );
  const program = readString(
    source.program,
    source.programSlug,
    source.program_slug,
    source.slug,
  );
  const program_title = readString(
    source.program_title,
    source.programTitle,
    source.programName,
    source.program_name,
  );
  const programId = readString(source.programId, source.program_id);
  const id = readString(source.id, source._id, source.studentId);
  const applicationFee = readNumber(
    source.applicationFee,
    source.application_fee,
    source.amount,
    source.priceAmount,
  );

  if (
    !email &&
    !first_name &&
    !last_name &&
    !phone_number &&
    !program &&
    !program_title
  ) {
    return undefined;
  }

  return {
    id: id || undefined,
    email: email || undefined,
    first_name: first_name || undefined,
    last_name: last_name || undefined,
    phone_number: phone_number || undefined,
    program: program || undefined,
    program_title: program_title || undefined,
    programId: programId || undefined,
    programSlug: program || undefined,
    applicationFee,
  };
}

export function normalizePaymentVerification(
  raw: unknown,
): PaymentVerificationData | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Record<string, unknown>;
  const reference =
    typeof row.reference === "string" ? row.reference.trim() : "";
  const paymentStatus = String(row.paymentStatus ?? "").toLowerCase();
  const fulfillmentStatus = String(row.fulfillmentStatus ?? "").toLowerCase();

  if (!reference) return null;
  if (
    paymentStatus !== "pending" &&
    paymentStatus !== "successful" &&
    paymentStatus !== "failed"
  ) {
    return null;
  }
  if (
    fulfillmentStatus !== "pending" &&
    fulfillmentStatus !== "completed" &&
    fulfillmentStatus !== "failed"
  ) {
    return null;
  }

  return {
    reference,
    paymentStatus,
    fulfillmentStatus,
    failureReason:
      typeof row.failureReason === "string" ? row.failureReason : undefined,
    applicationStatus:
      typeof row.applicationStatus === "string"
        ? row.applicationStatus
        : undefined,
    message: typeof row.message === "string" ? row.message : undefined,
    student: normalizeStudent(row),
  };
}

/** Paid + fulfilled — only then may signup continue past payment. */
export function isPaymentFullySuccessful(
  data: PaymentVerificationData | null | undefined,
): boolean {
  if (!data) return false;
  return (
    data.paymentStatus === "successful" &&
    data.fulfillmentStatus === "completed"
  );
}

export function readStoredPaymentReference(): string | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(PAYMENT_REFERENCE_STORAGE_KEY)?.trim();
  return value || null;
}

export function storePaymentReference(reference: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PAYMENT_REFERENCE_STORAGE_KEY, reference);
}

export function clearStoredPaymentReference(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PAYMENT_REFERENCE_STORAGE_KEY);
}

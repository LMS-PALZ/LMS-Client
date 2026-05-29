import {
  fetchAvailablePrograms,
  normalizePhoneNumberForApi,
  resolveProgramIdentifier,
  type RegisterStudentRequest,
} from "@ssu/api";
import { NextResponse } from "next/server";

const DEFAULT_API_BASE = "https://base-api.skillscaleup.org";

function apiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE
  );
}

function upstreamErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "Signup failed. Please try again.";
  }

  const record = data as Record<string, unknown>;

  if (typeof record.message === "string" && record.message.trim()) {
    return record.message;
  }

  const nested = record.data;
  if (nested && typeof nested === "object") {
    const errors = (nested as { errors?: Array<{ message?: string }> }).errors;
    const first = errors?.find((e) => e.message?.trim());
    if (first?.message) return first.message;
  }

  if (typeof record.error === "string" && record.error.trim()) {
    return record.error;
  }

  return "Signup failed. Please try again.";
}

export async function POST(request: Request) {
  let body: RegisterStudentRequest;

  try {
    body = (await request.json()) as RegisterStudentRequest;
  } catch {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 },
    );
  }

  const required: (keyof RegisterStudentRequest)[] = [
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "program",
  ];

  for (const key of required) {
    if (!body[key]?.trim?.()) {
      return NextResponse.json(
        { message: `Missing or invalid field: ${key}` },
        { status: 400 },
      );
    }
  }

  const base = apiBaseUrl();
  const programs = await fetchAvailablePrograms(base);
  const programId = resolveProgramIdentifier(body.program, programs);
  const phoneNumber = normalizePhoneNumberForApi(body.phone_number);

  try {
    const upstream = await fetch(`${base}/api/v1/students/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: body.first_name.trim(),
        last_name: body.last_name.trim(),
        email: body.email.trim().toLowerCase(),
        phone_number: phoneNumber,
        program: programId,
      }),
    });

    const data = await upstream.json().catch(() => ({}));

    if (!upstream.ok) {
      return NextResponse.json(
        { message: upstreamErrorMessage(data) },
        { status: upstream.status },
      );
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to reach registration service" },
      { status: 502 },
    );
  }
}

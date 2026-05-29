import type { SignUpFormValues } from "@ssu/schema";

export interface RegisterStudentRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  program: string;
}

export interface RegisterStudentSuccess {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export function toRegisterStudentRequest(
  input: SignUpFormValues,
): RegisterStudentRequest {
  return {
    first_name: input.firstName.trim(),
    last_name: input.lastName.trim(),
    email: input.email.trim().toLowerCase(),
    phone_number: input.phoneNumber.trim(),
    program: input.program,
  };
}

function parseSignupError(data: unknown): string {
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

export async function signupStudent(input: SignUpFormValues): Promise<
  | { ok: true; message: string }
  | {
      ok: false;
      code: "invalid" | "pending_approval" | "suspended";
      message: string;
    }
> {
  try {
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toRegisterStudentRequest(input)),
    });

    const data = (await response.json()) as RegisterStudentSuccess & {
      message?: string;
      error?: string;
    };

    if (!response.ok) {
      return {
        ok: false,
        code: "invalid",
        message: parseSignupError(data),
      };
    }

    const successMessage =
      typeof data.message === "string" && data.message.trim()
        ? data.message
        : "Check your email for a verification code.";

    return {
      ok: true,
      message: successMessage,
    };
  } catch {
    return {
      ok: false,
      code: "invalid",
      message: "An error occurred during signup",
    };
  }
}

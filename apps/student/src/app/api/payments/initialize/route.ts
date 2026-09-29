import { getApiBaseUrl } from "@ssu/api";
import { getPaymentVerifyCallbackUrl } from "@ssu/config/payment-callback";
import { NextRequest, NextResponse } from "next/server";

const RESUME_COOKIE = "ssu_payment_resume";

async function postInitialize(payload: Record<string, string>) {
  const upstream = await fetch(
    `${getApiBaseUrl()}/api/v1/payments/initialize`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  let body: unknown = null;
  try {
    body = await upstream.json();
  } catch {
    body = null;
  }

  return { upstream, body };
}

function resolveCallbackUrl(req: NextRequest, bodyCallback?: unknown): string {
  if (typeof bodyCallback === "string" && bodyCallback.trim()) {
    return bodyCallback.trim();
  }

  const fromEnv = getPaymentVerifyCallbackUrl();
  if (fromEnv.startsWith("http")) return fromEnv;

  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (host) {
    return getPaymentVerifyCallbackUrl(`${proto}://${host}`);
  }

  return fromEnv;
}

function withResumeCookie(res: NextResponse, resume: string | undefined) {
  if (!resume) return res;
  res.cookies.set({
    name: RESUME_COOKIE,
    value: resume,
    path: "/",
    maxAge: 60 * 60 * 2,
    sameSite: "lax",
    secure: true,
    httpOnly: false,
  });
  return res;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      email?: string;
      program?: string;
      callback_url?: string;
      resume?: string;
    };

    const email = body.email?.trim();
    const program = body.program?.trim();
    const resume = body.resume?.trim();

    if (!email || !program) {
      return NextResponse.json(
        { status: false, message: "email and program are required" },
        { status: 400 },
      );
    }

    const callback_url = resolveCallbackUrl(req, body.callback_url);

    const initial = await postInitialize({ email, program, callback_url });
    if (initial.upstream.ok) {
      return withResumeCookie(
        NextResponse.json(initial.body, {
          status: initial.upstream.status,
        }),
        resume,
      );
    }

    // If backend doesn't support `callback_url` yet, retry without it so payments still work.
    const retry = await postInitialize({ email, program });
    return withResumeCookie(
      NextResponse.json(retry.body ?? initial.body, {
        status: retry.upstream.status,
      }),
      resume,
    );
  } catch {
    return NextResponse.json(
      { status: false, message: "Payment initialization failed." },
      { status: 500 },
    );
  }
}

import { getApiBaseUrl } from "@ssu/api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference")?.trim();

  if (!reference) {
    return NextResponse.json(
      { status: false, message: "Payment reference is required." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const upstreamUrl = new URL(`${getApiBaseUrl()}/api/v1/payments/verify`);
    upstreamUrl.searchParams.set("reference", reference);
    upstreamUrl.searchParams.set("_", String(Date.now()));

    const upstream = await fetch(upstreamUrl.toString(), {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    let body: unknown = null;
    try {
      body = await upstream.json();
    } catch {
      body = {
        status: false,
        message: "Payment verification returned an invalid response.",
      };
    }

    return NextResponse.json(body, {
      status: upstream.status,
      headers: NO_STORE_HEADERS,
    });
  } catch {
    return NextResponse.json(
      { status: false, message: "Payment verification failed." },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

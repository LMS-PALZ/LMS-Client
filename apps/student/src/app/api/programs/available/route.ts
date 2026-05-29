import { NextResponse } from "next/server";

const DEFAULT_API_BASE = "https://base-api.skillscaleup.org";

function apiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? DEFAULT_API_BASE
  );
}

export async function GET() {
  try {
    const upstream = await fetch(`${apiBaseUrl()}/api/v1/programs/available`, {
      next: { revalidate: 300 },
    });
    const data = await upstream.json().catch(() => ({}));
    return NextResponse.json(data, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to load programs" },
      { status: 502 },
    );
  }
}

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "ssu_google_refresh";

export async function GET() {
  const store = await cookies();
  return NextResponse.json({
    connected: Boolean(store.get(COOKIE_NAME)?.value),
  });
}

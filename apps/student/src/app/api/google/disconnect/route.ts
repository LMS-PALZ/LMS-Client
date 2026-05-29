import { NextResponse } from "next/server";
import { clearRefreshTokenCookie } from "@/lib/token-cookie";

export async function POST() {
  await clearRefreshTokenCookie();
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createOAuthClient } from "@/lib/google-oauth";
import { setRefreshTokenCookie } from "@/lib/token-cookie";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      new URL(`/classroom?google=error`, request.url),
    );
  }

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  try {
    const oauth2 = createOAuthClient();
    const { tokens } = await oauth2.getToken(code);
    if (!tokens.refresh_token) {
      return NextResponse.redirect(
        new URL(`/classroom?google=no_refresh`, request.url),
      );
    }
    await setRefreshTokenCookie(tokens.refresh_token);
    return NextResponse.redirect(
      new URL("/classroom?google=connected", request.url),
    );
  } catch {
    return NextResponse.redirect(
      new URL(`/classroom?google=error`, request.url),
    );
  }
}

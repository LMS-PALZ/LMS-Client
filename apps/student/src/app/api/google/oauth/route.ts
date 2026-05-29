import { NextResponse } from "next/server";
import { createOAuthClient, getOAuthScopes } from "@/lib/google-oauth";

export function GET() {
  try {
    const oauth2 = createOAuthClient();
    const url = oauth2.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: getOAuthScopes(),
    });
    return NextResponse.redirect(url);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "OAuth configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

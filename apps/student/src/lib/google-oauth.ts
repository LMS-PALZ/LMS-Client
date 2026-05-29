import { google } from "googleapis";
import { getRefreshTokenFromCookie } from "./token-cookie";

export function createOAuthClient() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error("Google OAuth environment variables are not configured");
  }

  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export function getOAuthScopes(): string[] {
  const raw = process.env.GOOGLE_OAUTH_SCOPES;
  if (!raw) {
    return [
      "https://www.googleapis.com/auth/classroom.courses.readonly",
      "https://www.googleapis.com/auth/classroom.coursework.me.readonly",
    ];
  }
  return raw.split(",").map((s) => s.trim());
}

export async function getAuthorizedClassroomClient() {
  const refreshToken = await getRefreshTokenFromCookie();
  if (!refreshToken) {
    return null;
  }

  const oauth2 = createOAuthClient();
  oauth2.setCredentials({ refresh_token: refreshToken });
  return google.classroom({ version: "v1", auth: oauth2 });
}

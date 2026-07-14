import { createHmac } from "node:crypto";

function base64UrlEncode(value: string): string {
  return Buffer.from(value).toString("base64url");
}

export function readZoomSdkCredentials(): {
  clientId: string;
  clientSecret: string;
} {
  const clientId =
    process.env.ZOOM_MEETING_SDK_CLIENT_ID?.trim() ||
    process.env.ZOOM_SDK_KEY?.trim() ||
    "";
  const clientSecret =
    process.env.ZOOM_MEETING_SDK_CLIENT_SECRET?.trim() ||
    process.env.ZOOM_SDK_SECRET?.trim() ||
    "";

  return { clientId, clientSecret };
}

export function generateMeetingSdkSignature(
  clientId: string,
  clientSecret: string,
  meetingNumber: string,
  role: 0 | 1 = 0,
): string {
  const iat = Math.floor(Date.now() / 1000) - 30;
  const exp = iat + 60 * 60 * 2;

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      appKey: clientId,
      mn: meetingNumber,
      role,
      iat,
      exp,
      tokenExp: exp,
    }),
  );

  const data = `${header}.${payload}`;
  const signature = createHmac("sha256", clientSecret)
    .update(data)
    .digest("base64url");

  return `${data}.${signature}`;
}

export function normalizeMeetingNumber(value: string): string {
  return value.replace(/\D/g, "");
}

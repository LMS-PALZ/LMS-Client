import { KJUR } from "jsrsasign";

export function readZoomSdkCredentials(): {
  clientId: string;
  clientSecret: string;
} {
  const clientId =
    process.env.ZOOM_MEETING_SDK_CLIENT_ID?.trim() ||
    process.env.ZOOM_MEETING_SDK_KEY?.trim() ||
    process.env.ZOOM_SDK_KEY?.trim() ||
    "";
  const clientSecret =
    process.env.ZOOM_MEETING_SDK_CLIENT_SECRET?.trim() ||
    process.env.ZOOM_MEETING_SDK_SECRET?.trim() ||
    process.env.ZOOM_SDK_SECRET?.trim() ||
    "";

  return { clientId, clientSecret };
}

/**
 * Meeting SDK JWT — matches Zoom's official auth-endpoint sample (jsrsasign).
 * @see https://github.com/zoom/meetingsdk-auth-endpoint-sample
 * @see https://developers.zoom.us/docs/meeting-sdk/auth/
 */
export function generateMeetingSdkSignature(
  clientId: string,
  clientSecret: string,
  meetingNumber: string,
  role: 0 | 1 = 0,
): string {
  const mn = normalizeMeetingNumber(meetingNumber);
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 2;

  const oHeader = { alg: "HS256", typ: "JWT" };
  const oPayload = {
    appKey: clientId,
    sdkKey: clientId,
    mn,
    role,
    iat,
    exp,
    tokenExp: exp,
  };

  return KJUR.jws.JWS.sign(
    "HS256",
    JSON.stringify(oHeader),
    JSON.stringify(oPayload),
    clientSecret,
  );
}

export function normalizeMeetingNumber(value: string): string {
  return value.replace(/\D/g, "");
}

/** User-facing hint for Zoom error 3712 / invalid signature. */
export const ZOOM_SIGNATURE_INVALID_HINT =
  "Zoom rejected the join signature (error 3712). In Zoom Marketplace → your app → Features → Embed, turn on Meeting SDK. Use that app’s Client ID and Client Secret (not Server-to-Server OAuth). The meeting must belong to the same Zoom account, or the app must be approved for external meetings.";

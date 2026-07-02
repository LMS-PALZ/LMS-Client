export function normalizeMeetingJoinUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export type MeetingEmbedKind = "zoom" | "jitsi" | "google-meet" | "generic";

export type ParsedMeetingTarget =
  | {
      kind: "zoom";
      joinUrl: string;
      embedUrl: string;
      meetingNumber: string;
      password?: string;
    }
  | {
      kind: "jitsi";
      joinUrl: string;
      domain: string;
      roomName: string;
    }
  | {
      kind: "google-meet";
      joinUrl: string;
      embedUrl: string;
    }
  | {
      kind: "generic";
      joinUrl: string;
      embedUrl: string;
    };

export function getMeetingProviderLabel(url: string): string {
  const target = parseMeetingTarget(url);
  switch (target?.kind) {
    case "zoom":
      return "Zoom";
    case "jitsi":
      return "Jitsi";
    case "google-meet":
      return "Google Meet";
    default:
      return "meeting";
  }
}

export function parseZoomMeeting(
  url: string,
): { meetingNumber: string; password?: string } | null {
  const normalized = normalizeMeetingJoinUrl(url);
  if (!normalized) return null;

  const meetingMatch =
    normalized.match(/\/j\/(\d+)/i) ||
    normalized.match(/\/wc\/join\/(\d+)/i) ||
    normalized.match(/[?&]confno=(\d+)/i);

  if (!meetingMatch?.[1]) return null;

  let password: string | undefined;
  try {
    const parsed = new URL(normalized);
    password =
      parsed.searchParams.get("pwd") ||
      parsed.searchParams.get("password") ||
      undefined;
  } catch {
    password = undefined;
  }

  return {
    meetingNumber: meetingMatch[1],
    password,
  };
}

export function toZoomWebClientEmbedUrl(url: string): string {
  const parsed = parseZoomMeeting(url);
  if (!parsed) return normalizeMeetingJoinUrl(url);

  const params = new URLSearchParams();
  if (parsed.password) params.set("pwd", parsed.password);

  const query = params.toString();
  return `https://zoom.us/wc/join/${parsed.meetingNumber}${query ? `?${query}` : ""}`;
}

function parseJitsiMeeting(
  url: string,
): { domain: string; roomName: string } | null {
  const normalized = normalizeMeetingJoinUrl(url);
  if (!normalized) return null;

  try {
    const parsed = new URL(normalized);
    const roomName = parsed.pathname.replace(/^\//, "").split("/")[0];
    if (!roomName) return null;

    return {
      domain: parsed.host,
      roomName: decodeURIComponent(roomName),
    };
  } catch {
    return null;
  }
}

export function parseMeetingTarget(url: string): ParsedMeetingTarget | null {
  const joinUrl = normalizeMeetingJoinUrl(url);
  if (!joinUrl) return null;

  if (/meet\.google\.com/i.test(joinUrl)) {
    return {
      kind: "google-meet",
      joinUrl,
      embedUrl: joinUrl,
    };
  }

  const zoom = parseZoomMeeting(joinUrl);
  if (zoom || /zoom\.(us|com)/i.test(joinUrl)) {
    return {
      kind: "zoom",
      joinUrl,
      embedUrl: toZoomWebClientEmbedUrl(joinUrl),
      meetingNumber: zoom?.meetingNumber ?? "",
      password: zoom?.password,
    };
  }

  const jitsi = parseJitsiMeeting(joinUrl);
  if (jitsi && /jit\.si|jitsi/i.test(jitsi.domain)) {
    return {
      kind: "jitsi",
      joinUrl,
      domain: jitsi.domain,
      roomName: jitsi.roomName,
    };
  }

  return {
    kind: "generic",
    joinUrl,
    embedUrl: joinUrl,
  };
}

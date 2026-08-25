export function normalizeMeetingJoinUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export type MeetingEmbedKind = "zoom" | "google-meet" | "generic";

export type ParsedMeetingTarget =
  | {
      kind: "zoom";
      joinUrl: string;
      embedUrl: string;
      meetingNumber: string;
      password?: string;
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

export function parseZoomMeeting(
  url: string,
): { meetingNumber: string; password?: string } | null {
  const normalized = normalizeMeetingJoinUrl(url);
  if (!normalized) return null;

  const meetingMatch =
    normalized.match(/\/j\/(\d+)/i) ||
    normalized.match(/\/wc\/join\/(\d+)/i) ||
    normalized.match(/\/s\/(\d+)/i) ||
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

  return {
    kind: "generic",
    joinUrl,
    embedUrl: joinUrl,
  };
}

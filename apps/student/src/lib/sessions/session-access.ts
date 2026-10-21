import type { LiveSessionItem } from "@ssu/types";

const DEFAULT_LIVE_WINDOW_MINUTES = 120;

export function hasRecordingUrl(
  session: Pick<LiveSessionItem, "recordingUrl">,
): boolean {
  return Boolean(session.recordingUrl?.trim());
}

function readStartMs(startsAt: string | undefined): number | null {
  if (!startsAt?.trim()) return null;
  const start = new Date(startsAt).getTime();
  return Number.isNaN(start) ? null : start;
}

/** Live Zoom join: only between start and end of the live window. */
export function isLiveJoinEnabled(
  session: Pick<LiveSessionItem, "startsAt" | "durationMinutes" | "isLive">,
  now = new Date(),
): boolean {
  const startMs = readStartMs(session.startsAt);
  if (startMs == null) return Boolean(session.isLive);

  const nowMs = now.getTime();
  if (nowMs < startMs) return false;

  const duration =
    session.durationMinutes && session.durationMinutes > 0
      ? session.durationMinutes
      : DEFAULT_LIVE_WINDOW_MINUTES;
  const endMs = startMs + duration * 60_000;
  return nowMs <= endMs;
}

/** Pre-recorded: play once the scheduled start has passed (not before). */
export function isRecordingPlayEnabled(
  session: Pick<LiveSessionItem, "startsAt">,
  now = new Date(),
): boolean {
  const startMs = readStartMs(session.startsAt);
  // No schedule → treat as available whenever a recording URL exists.
  if (startMs == null) return true;
  return now.getTime() >= startMs;
}

export function isSessionActionEnabled(
  session: Pick<
    LiveSessionItem,
    "startsAt" | "durationMinutes" | "isLive" | "recordingUrl"
  >,
  now = new Date(),
): boolean {
  if (hasRecordingUrl(session)) {
    return isRecordingPlayEnabled(session, now);
  }
  return isLiveJoinEnabled(session, now);
}

export type HomeSessionCardStatus = "live" | "upcoming" | "recorded";

export function resolveHomeSessionCardStatus(
  session: Pick<
    LiveSessionItem,
    "startsAt" | "isLive" | "recordingUrl" | "durationMinutes"
  >,
  now = new Date(),
): HomeSessionCardStatus {
  if (hasRecordingUrl(session)) {
    return isRecordingPlayEnabled(session, now) ? "recorded" : "upcoming";
  }
  if (session.isLive || isLiveJoinEnabled(session, now)) return "live";
  return "upcoming";
}

export function homeSessionActionLabel(
  session: Pick<LiveSessionItem, "recordingUrl">,
): string {
  return hasRecordingUrl(session) ? "Play class recording" : "Join live class";
}

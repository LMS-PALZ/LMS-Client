import type { LiveSessionItem } from "@ssu/types";
import { hasRecordingUrl, isLiveJoinEnabled } from "./session-access";

function isSameLocalDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Live or still-upcoming sessions scheduled for the viewer's local today. */
export function filterTodayRemainingSessions(
  sessions: LiveSessionItem[],
  now = new Date(),
): LiveSessionItem[] {
  return sessions.filter((session) => {
    if (!session.startsAt) return false;

    const start = new Date(session.startsAt);
    if (Number.isNaN(start.getTime())) return false;
    if (!isSameLocalDay(start, now)) return false;

    if (hasRecordingUrl(session) || session.lessonType === "recording") {
      return true;
    }

    if (session.isLive || isLiveJoinEnabled(session, now)) return true;

    return start.getTime() > now.getTime();
  });
}

/** The single next relevant class for today: live now, otherwise earliest upcoming. */
export function findNextTodaySession(
  sessions: LiveSessionItem[],
  now = new Date(),
): LiveSessionItem | null {
  const todaySessions = filterTodayRemainingSessions(sessions, now);
  if (todaySessions.length === 0) return null;

  return [...todaySessions].sort((a, b) => {
    const aLive =
      !hasRecordingUrl(a) && (a.isLive || isLiveJoinEnabled(a, now));
    const bLive =
      !hasRecordingUrl(b) && (b.isLive || isLiveJoinEnabled(b, now));
    if (aLive !== bLive) return aLive ? -1 : 1;
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  })[0];
}

/**
 * Home preview: live classes (now or upcoming) plus today's recordings
 * (upcoming or already started so students can play them). Max three.
 */
export function buildHomeSessionCards(
  sessions: LiveSessionItem[],
  now = new Date(),
): LiveSessionItem[] {
  const nowMs = now.getTime();

  return sessions
    .filter((session) => {
      if (hasRecordingUrl(session)) {
        if (!session.startsAt?.trim()) return true;
        const start = new Date(session.startsAt);
        if (Number.isNaN(start.getTime())) return true;
        const startMs = start.getTime();
        return startMs > nowMs || isSameLocalDay(start, now);
      }

      if (!session.startsAt?.trim()) return false;
      const start = new Date(session.startsAt);
      if (Number.isNaN(start.getTime())) return false;
      const startMs = start.getTime();

      if (session.isLive || isLiveJoinEnabled(session, now)) return true;
      return startMs > nowMs;
    })
    .sort((a, b) => {
      const aLive =
        !hasRecordingUrl(a) && (a.isLive || isLiveJoinEnabled(a, now));
      const bLive =
        !hasRecordingUrl(b) && (b.isLive || isLiveJoinEnabled(b, now));
      if (aLive !== bLive) return aLive ? -1 : 1;
      const aTime = a.startsAt ? new Date(a.startsAt).getTime() : 0;
      const bTime = b.startsAt ? new Date(b.startsAt).getTime() : 0;
      return aTime - bTime;
    })
    .slice(0, 3);
}

export function formatSessionDayLabel(iso: string, now = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  if (isSameLocalDay(date, now)) return "Today";

  return date.toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
  });
}

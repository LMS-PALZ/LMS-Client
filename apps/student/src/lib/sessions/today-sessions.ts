import type { LiveSessionItem } from "@ssu/types";

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

    if (session.isLive) return true;

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
    if (a.isLive !== b.isLive) return a.isLive ? -1 : 1;
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  })[0];
}

function isUpcomingSession(session: LiveSessionItem, now: Date): boolean {
  if (session.isLive) return false;
  if (!session.startsAt) return false;

  const start = new Date(session.startsAt);
  if (Number.isNaN(start.getTime())) return false;

  return start.getTime() > now.getTime();
}

/** Home dashboard: one live card plus the next two upcoming classes. */
export function buildHomeSessionCards(
  sessions: LiveSessionItem[],
  now = new Date(),
): LiveSessionItem[] {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  const live = sorted.find((session) => session.isLive) ?? null;
  const upcoming = sorted.filter((session) => isUpcomingSession(session, now));

  if (live) {
    return [live, ...upcoming.slice(0, 2)];
  }

  return upcoming.slice(0, 3);
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

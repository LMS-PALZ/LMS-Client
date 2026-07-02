import type { LiveSessionItem, NotificationDto } from "@ssu/types";

const MAX_UPCOMING = 5;

function isUpcomingSession(session: LiveSessionItem, now: Date): boolean {
  if (session.isLive) return false;
  if (!session.startsAt) return false;

  const start = new Date(session.startsAt);
  if (Number.isNaN(start.getTime())) return false;

  return start.getTime() > now.getTime();
}

function formatUpcomingTime(startsAt: string, now = new Date()): string {
  const start = new Date(startsAt);
  if (Number.isNaN(start.getTime())) return "soon";

  const isToday =
    start.getFullYear() === now.getFullYear() &&
    start.getMonth() === now.getMonth() &&
    start.getDate() === now.getDate();

  const time = start.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return `today at ${time}`;

  const date = start.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return `${date} at ${time}`;
}

/** Temporary source until a dedicated notifications API exists. */
export function buildClassNotifications(
  sessions: LiveSessionItem[],
  now = new Date(),
): NotificationDto[] {
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  const liveSessions = sorted.filter((session) => session.isLive);
  const upcomingSessions = sorted
    .filter((session) => isUpcomingSession(session, now))
    .slice(0, MAX_UPCOMING);

  const liveNotifications: NotificationDto[] = liveSessions.map((session) => ({
    id: `class-live-${session.id}`,
    kind: "class-live",
    message: `"${session.title}" is live now. Tap to join your class.`,
    createdAt: session.startsAt,
    read: false,
    href: `/classroom/${session.id}`,
  }));

  const upcomingNotifications: NotificationDto[] = upcomingSessions.map(
    (session) => ({
      id: `class-upcoming-${session.id}`,
      kind: "class-upcoming",
      message: `Upcoming class: "${session.title}" starts ${formatUpcomingTime(session.startsAt, now)}.`,
      createdAt: session.startsAt,
      read: false,
      href: `/classroom/${session.id}`,
    }),
  );

  return [...liveNotifications, ...upcomingNotifications];
}

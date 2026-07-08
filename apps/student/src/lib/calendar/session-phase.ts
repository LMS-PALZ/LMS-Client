import type { SessionPhase } from "@/lib/classroom/types";

const DEFAULT_LIVE_WINDOW_MINUTES = 120;

function readIsoDate(value: string | undefined): Date | null {
  if (!value?.trim()) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function resolveLessonSessionPhase(
  startsAt: string | undefined,
  durationMinutes?: number,
  isLiveNow?: boolean,
): SessionPhase {
  if (isLiveNow) return "live";

  const start = readIsoDate(startsAt);
  if (!start) return "upcoming";

  const now = Date.now();
  const duration =
    durationMinutes && durationMinutes > 0
      ? durationMinutes
      : DEFAULT_LIVE_WINDOW_MINUTES;
  const end = start.getTime() + duration * 60_000;

  if (now > end) return "ended";

  const liveWindowEnd = start.getTime() + DEFAULT_LIVE_WINDOW_MINUTES * 60_000;
  if (now >= start.getTime() && now <= liveWindowEnd) return "live";

  return "upcoming";
}

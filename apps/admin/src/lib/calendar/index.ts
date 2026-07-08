import { buildAdminCalendarEvents } from "./mappers";
import type { AdminCalendarEvent } from "./types";

export { buildAdminCalendarEvents } from "./mappers";
export { resolveLessonSessionPhase } from "./session-phase";
export type { AdminCalendarEvent, SessionPhase } from "./types";

export function mapSnapshotsToCalendarEvents(
  snapshots: Parameters<typeof buildAdminCalendarEvents>[0],
): AdminCalendarEvent[] {
  return buildAdminCalendarEvents(snapshots);
}

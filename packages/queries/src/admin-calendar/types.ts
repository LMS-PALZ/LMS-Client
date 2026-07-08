export type SessionPhase = "live" | "upcoming" | "ended";

export interface AdminCalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  href: string;
  sessionPhase: SessionPhase;
  programId: string;
  programTitle: string;
  cohortName?: string;
  moduleTitle?: string;
  lessonId: string;
  lessonTitle: string;
  durationMinutes: number;
  tutorCount: number;
}

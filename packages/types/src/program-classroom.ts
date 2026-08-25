export type ClassroomLessonType =
  | "live_session"
  | "recording"
  | "reading"
  | "assignment"
  | "resource"
  | "other";

export interface ClassroomLessonResource {
  id?: string;
  title?: string;
  url?: string;
  type?: string;
  content?: string | null;
}

export interface ProgramClassroomLesson {
  id: string;
  title: string;
  summary?: string;
  overview?: string;
  lessonType: ClassroomLessonType;
  order?: number;
  isPublished?: boolean;
  durationMinutes?: number;
  liveSessionUrl?: string;
  startsAt?: string;
  recordingUrl?: string;
  zoomMeetingId?: string;
  zoomMeetingUuid?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  isLiveNow?: boolean;
  resources?: ClassroomLessonResource[];
}

export interface ProgramClassroomModule {
  id: string;
  title: string;
  description?: string;
  summary?: string;
  weekLabel?: string;
  moduleType?: string;
  lessonCount: number;
  order?: number;
  lessons?: ProgramClassroomLesson[];
}

export interface ProgramClassroomSummary {
  id?: string;
  title?: string;
  description?: string;
  status?: "draft" | "published";
  modules: ProgramClassroomModule[];
}

export interface UpsertClassroomModulePayload {
  id?: string;
  title: string;
  summary?: string;
  weekLabel?: string;
  order?: number;
  lessons?: UpsertClassroomLessonPayload[];
}

export interface UpsertClassroomLessonPayload {
  id?: string;
  title: string;
  summary?: string;
  overview?: string;
  lessonType: ClassroomLessonType;
  order?: number;
  isPublished?: boolean;
  durationMinutes?: number;
  liveSessionUrl?: string;
  startsAt?: string;
  recordingUrl?: string;
}

export interface UpsertProgramClassroomPayload {
  title: string;
  description?: string;
  status: "draft" | "published";
  modules: UpsertClassroomModulePayload[];
}

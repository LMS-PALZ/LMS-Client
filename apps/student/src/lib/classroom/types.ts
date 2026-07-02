export type SessionPhase = "live" | "upcoming" | "ended";

export type LiveVideoProvider = "zoom";

export type ClassroomLessonType = "live" | "recorded" | "reading";

export interface ClassroomResource {
  id: string;
  title: string;
  type?: string;
  url?: string | null;
  content?: string | null;
  fileUrl?: string;
  meta?: string;
}

export interface ClassroomRecording {
  id: string;
  title: string;
  recordingUrl: string;
  duration: number;
}

export interface ClassroomLesson {
  id: string;
  title: string;
  type: ClassroomLessonType;
  subtitle: string;
  completed?: boolean;
  description?: string;
}

export interface ClassroomWeek {
  id: string;
  label: string;
  topic: string;
  expanded?: boolean;
  lessons: ClassroomLesson[];
}

export interface ClassroomCourseDetail {
  id: string;
  title: string;
  courseLabel: string;
  syllabusCount: number;
  sessionPhase: SessionPhase;
  sessionId?: string;
  sessionLabel: string;
  sessionDuration: string;
  scheduledAt?: string;
  meetUrl: string;
  liveVideoProvider?: LiveVideoProvider;
  description: string;
  overview: string;
  recordingSummary: string;
  recordingTitle?: string;
  recordingEmbedUrl: string | null;
  resources: ClassroomResource[];
  href: string;
  recordings?: ClassroomRecording[];
}

export type SessionPhase = "live" | "upcoming" | "ended";

export type LiveVideoProvider = "google-meet" | "jitsi";

export type ClassroomLessonType = "live" | "recording" | "reading";

export interface ClassroomResource {
  id: string;
  title: string;
  meta: string;
  fileUrl: string;
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
  jitsiRoomName?: string;
  description: string;
  overview: string;
  recordingSummary: string;
  recordingTitle?: string;
  recordingEmbedUrl: string | null;
  resources: ClassroomResource[];
  href: string;
}

export interface ClassroomCourseItem {
  id: string;
  title: string;
  courseLabel: string;
  syllabusCount: number;
  sessionPhase: SessionPhase;
  sessionId?: string;
  href: string;
}

export interface ClassroomProgram {
  id: string;
  title: string;
  description: string;
  contentCount: string;
  duration: string;
  startDate: string;
  endDate: string;
}

export interface ClassroomLiveSession {
  sessionId: string;
  courseId: string;
  title: string;
  time: string;
  date: string;
  phase: SessionPhase;
  meetUrl: string;
  liveVideoProvider?: LiveVideoProvider;
  jitsiRoomName?: string;
}

export interface ClassroomDataFile {
  program: ClassroomProgram;
  liveSession: ClassroomLiveSession;
  defaultMeetUrl: string;
  defaultRecordingEmbedUrl: string;
  defaultResourcePdf: string;
  courses: Omit<ClassroomCourseDetail, "href">[];
  weeksByCourse: Record<string, ClassroomWeek[]>;
}

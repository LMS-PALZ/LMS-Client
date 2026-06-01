export type UserRole = "students" | "trainer" | "admin";

export type UserStatus = "active" | "pending" | "suspended";

export type AssignmentStatus =
  | "not-started"
  | "submitted"
  | "graded"
  | "returned"
  | "overdue";

export type ModuleType = "live" | "recorded" | "reading";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  trainerName: string;
  bannerUrl?: string;
  progressPercent: number;
}

export type SessionDisplayStatus = "live" | "upcoming" | "ended" | "countdown";

export interface LiveSessionItem {
  id: string;
  title: string;
  courseName: string;
  startsAt: string;
  isLive: boolean;
  endsAt?: string;
  meetingUrl?: string;
  description?: string;
}

export interface StudentProgress {
  overallScorePercent: number;
  enrolledProgramTitle: string;
}

export interface GoogleClassroomCourse {
  id: string;
  name: string;
  section?: string;
  description?: string;
  courseState: string;
  alternateLink?: string;
}

export interface GoogleClassroomCourseWork {
  id: string;
  courseId: string;
  title: string;
  dueAt?: string;
  maxPoints?: number;
  workType: string;
  alternateLink?: string;
}

export interface CurriculumWeek {
  id: string;
  title: string;
  subtitle?: string;
  lessons: CurriculumLesson[];
}

export interface CurriculumLesson {
  id: string;
  title: string;
  type: ModuleType;
  scheduledAt?: string;
  completed: boolean;
  sessionId?: string;
}

export interface AssignmentListItem {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueAt: string;
  status: AssignmentStatus;
  moduleLabel?: string;
  weightPercent?: number;
  scoreDisplay?: string;
}

export type { AvailableProgram } from "./programs";

export interface NotificationDto {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface CustomSelectProps {
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  showErrorMessage?: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
}

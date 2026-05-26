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

export interface LiveSessionItem {
  id: string;
  title: string;
  courseName: string;
  startsAt: string;
  isLive: boolean;
}

export interface AssignmentListItem {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  dueAt: string;
  status: AssignmentStatus;
}

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

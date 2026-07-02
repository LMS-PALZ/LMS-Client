export type StaffPortalRole = "super_admin" | "admin" | "tutor" | "trainer";
export type UserRole = "students" | StaffPortalRole;

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
  accessToken: string;
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
export type {
  AdminProgram,
  AdminProgramListResponse,
  CreateProgramPayload,
  ProgramStatus,
  UpdateProgramStatusPayload,
} from "./admin-program";
export type {
  AdminTransaction,
  AdminTransactionDetail,
  AdminTransactionListMeta,
  AdminTransactionListResult,
  AdminTransactionPagination,
  TransactionStatus,
} from "./admin-transaction";
export type {
  ProgramApplicant,
  ProgramApplicantStatus,
  ProgramApplicantsResponse,
} from "./program-applicant";
export type {
  ClassroomLessonType,
  ProgramClassroomLesson,
  ProgramClassroomModule,
  ProgramClassroomSummary,
  UpsertClassroomLessonPayload,
  UpsertClassroomModulePayload,
  UpsertProgramClassroomPayload,
} from "./program-classroom";

export interface NotificationDto {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
  kind?: string;
}

export interface CustomSelectProps {
  placeholder: string;
  options: string[];
  value: string;
  className?: string;
  onChange: (value: string) => void;
  error?: string;
  showErrorMessage?: boolean;
}

export interface NotificationItem {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  href?: string;
  kind?: string;
}

export interface StudentProfile {
  firstName: string;
  lastName: string;
  programTitle: string;
  image: string;
}

export interface StudentInfo {
  email: string;
  phoneNumber: string;
  dob: {
    day: string;
    month: string;
    year: number;
  };
  address: string;
  cohortName: string;
  enrollmentDate: string;
  idDocumentUrl?: string;
}

export interface ProgressData {
  progressPercent: number;
  completed: number;
  total: number;
  description?: string;
}

export interface AttendanceRecord {
  id: string;
  title: string;
  date: string;
  week: string;
  status: "present" | "absent";
}

export interface ProgressCardProps {
  title: string;
  data: ProgressData;
}

export type Status =
  | "Good standing"
  | "flagged"
  | "access-revoked"
  | "active"
  | "invited"
  | "suspended";

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  programTitle: string;
  progressPercent: number;
  attendance: {
    display: string;
  };
  statusLabel: Status;
}

export interface StudentStat {
  id: string;
  title: string;
  value: number;
  description: string;
}

export interface Trainers {
  id: string;
  name: string;
  email?: string;
  role?: string;
  assignedProgram: string;
  inviteAcceptedAt: string;
  status: Status;
}

export interface Admins {
  id: string;
  name: string;
  email?: string;
  role: string;
  inviteAcceptedAt: string;
  status: Status;
}

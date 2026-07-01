export type CourseStatus = "draft" | "published";

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  initials?: string;
  avatarColor?: string;
}

export interface Cohort {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  price: string;
  status: CourseStatus;
  instructors: Instructor[];
  cohorts: Cohort[];
  createdAt: string;
}

export interface CourseDraft {
  name: string;
  description: string;
  price: string;
  capacity: string;
  instructors: Instructor[];
  cohorts: Cohort[];
}

export const COURSE_DESCRIPTION_MAX = 140;
export const MAX_COHORTS_PER_YEAR = 8;

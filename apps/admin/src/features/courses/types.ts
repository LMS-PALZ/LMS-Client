export type CourseStatus = "draft" | "published";

export const COURSE_SUCCESS_MESSAGES: Record<CourseStatus, string> = {
  published: "You have successfully published a course.",
  draft: "You have successfully saved a course as draft.",
};

export * from "./types/ui";
export * from "./types/activity";

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
  updatedAt: string;
}

export interface CourseDraft {
  name: string;
  description: string;
  price: string;
  capacity: string;
  instructors: Instructor[];
  cohorts: Cohort[];
  isGeneral: boolean;
}

export const COURSE_DESCRIPTION_MAX = 140;
export const MAX_COHORTS_PER_YEAR = 8;

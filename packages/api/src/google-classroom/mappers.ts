import type {
  GoogleClassroomCourse,
  GoogleClassroomCourseWork,
} from "@ssu/types";

export function mapGoogleCourse(raw: {
  id?: string | null;
  name?: string | null;
  section?: string | null;
  descriptionHeading?: string | null;
  courseState?: string | null;
  alternateLink?: string | null;
}): GoogleClassroomCourse {
  return {
    id: raw.id ?? "",
    name: raw.name ?? "Untitled course",
    section: raw.section ?? undefined,
    description: raw.descriptionHeading ?? undefined,
    courseState: raw.courseState ?? "ACTIVE",
    alternateLink: raw.alternateLink ?? undefined,
  };
}

export function mapGoogleCourseWork(
  courseId: string,
  raw: {
    id?: string | null;
    title?: string | null;
    dueDate?: {
      year?: number | null;
      month?: number | null;
      day?: number | null;
    } | null;
    dueTime?: {
      hours?: number | null;
      minutes?: number | null;
    } | null;
    maxPoints?: number | null;
    workType?: string | null;
    alternateLink?: string | null;
  },
): GoogleClassroomCourseWork {
  let dueAt: string | undefined;
  const y = raw.dueDate?.year;
  const m = raw.dueDate?.month;
  const d = raw.dueDate?.day;
  if (y != null && m != null && d != null) {
    const date = new Date(
      y,
      m - 1,
      d,
      raw.dueTime?.hours ?? 23,
      raw.dueTime?.minutes ?? 59,
    );
    dueAt = date.toISOString();
  }

  return {
    id: raw.id ?? "",
    courseId,
    title: raw.title ?? "Untitled",
    dueAt,
    maxPoints: raw.maxPoints ?? undefined,
    workType: raw.workType ?? "ASSIGNMENT",
    alternateLink: raw.alternateLink ?? undefined,
  };
}

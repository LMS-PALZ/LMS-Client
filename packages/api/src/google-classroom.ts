import type {
  GoogleClassroomCourse,
  GoogleClassroomCourseWork,
} from "@ssu/types";

export interface GoogleConnectionStatus {
  connected: boolean;
}

async function parseJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || res.statusText);
  }
  return res.json() as Promise<T>;
}

export const googleClassroomApi = {
  async getConnectionStatus(): Promise<GoogleConnectionStatus> {
    const res = await fetch("/api/google/status", { credentials: "include" });
    return parseJson<GoogleConnectionStatus>(res);
  },

  connect(): void {
    window.location.href = "/api/google/oauth";
  },

  async disconnect(): Promise<void> {
    await fetch("/api/google/disconnect", {
      method: "POST",
      credentials: "include",
    });
  },

  async listCourses(): Promise<GoogleClassroomCourse[]> {
    const res = await fetch("/api/classroom/courses", {
      credentials: "include",
    });
    const data = await parseJson<{ courses: GoogleClassroomCourse[] }>(res);
    return data.courses;
  },

  async listCoursework(courseId: string): Promise<GoogleClassroomCourseWork[]> {
    const res = await fetch(
      `/api/classroom/coursework?courseId=${encodeURIComponent(courseId)}`,
      { credentials: "include" },
    );
    const data = await parseJson<{ coursework: GoogleClassroomCourseWork[] }>(
      res,
    );
    return data.coursework;
  },
};

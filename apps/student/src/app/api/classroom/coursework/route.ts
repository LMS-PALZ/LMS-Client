import { mapGoogleCourseWork } from "@ssu/api";
import { NextResponse } from "next/server";
import { getAuthorizedClassroomClient } from "@/lib/google-oauth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");

  if (!courseId) {
    return NextResponse.json({ error: "courseId required" }, { status: 400 });
  }

  const classroom = await getAuthorizedClassroomClient();
  if (!classroom) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  try {
    const res = await classroom.courses.courseWork.list({
      courseId,
      orderBy: "dueDate desc",
    });
    const coursework = (res.data.courseWork ?? []).map((item) =>
      mapGoogleCourseWork(courseId, item),
    );
    return NextResponse.json({ coursework });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load coursework";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

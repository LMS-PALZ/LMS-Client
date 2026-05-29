import { mapGoogleCourse } from "@ssu/api";
import { NextResponse } from "next/server";
import { getAuthorizedClassroomClient } from "@/lib/google-oauth";

export async function GET() {
  const classroom = await getAuthorizedClassroomClient();
  if (!classroom) {
    return NextResponse.json({ error: "Not connected" }, { status: 401 });
  }

  try {
    const res = await classroom.courses.list({
      studentId: "me",
      courseStates: ["ACTIVE"],
    });
    const courses = (res.data.courses ?? []).map(mapGoogleCourse);
    return NextResponse.json({ courses });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load courses";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

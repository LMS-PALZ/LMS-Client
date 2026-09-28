"use client";

import { StudentProfileCard } from "@/components/students-details/ProfileCard";
import { StudentInfoCard } from "@/components/students-details/StudentInfoCard";
import { AttendanceTable } from "@/components/students-details/AttendanceTable";
import { ProgressCard } from "@/components/students-details/ProgressCard";
import type { AdminStudentDetails } from "@ssu/types";

export interface StudentDetailsProps {
  student: AdminStudentDetails;
}

export function StudentDetails({ student }: StudentDetailsProps) {
  const totalWeeks = student.overallCompletion?.totalWeeks ?? 0;
  const week = student.overallCompletion?.week ?? 0;
  const completionPercent =
    totalWeeks > 0 ? Math.round((week / totalWeeks) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <StudentProfileCard profile={student} />
        <StudentInfoCard info={student} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <ProgressCard
          title="Overall completion"
          data={{
            progressPercent: completionPercent,
            completed: week,
            total: totalWeeks,
            description:
              totalWeeks > 0 ? `Week ${week} of ${totalWeeks}` : undefined,
          }}
        />
        <ProgressCard
          title="Cumulative score"
          data={{
            progressPercent: student.cumulativeScore ?? 0,
            completed: student.cumulativeScore ?? 0,
            total: 100,
            description:
              "A cumulative score of 70% is required for graduation.",
          }}
        />
      </div>

      <AttendanceTable attendance={student.sessionAttendance ?? []} />
    </div>
  );
}

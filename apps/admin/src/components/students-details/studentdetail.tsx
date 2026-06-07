"use client";

import {
  StudentProfile,
  StudentInfo,
  ProgressData,
  AttendanceRecord,
} from "@ssu/types";

import { StudentProfileCard } from "@/components/students-details/ProfileCard";
import { StudentInfoCard } from "@/components/students-details/StudentInfoCard";
import { ProgressCard } from "@/components/students-details/ProgressCard";
import { AttendanceTable } from "@/components/students-details/AttendanceTable";

export interface StudentDetailsProps {
  profile: StudentProfile;
  info: StudentInfo;

  completion: ProgressData;
  cumulativeScore: ProgressData;

  attendance: AttendanceRecord[];

  onRevokeAccess?: () => void;
}

export function StudentDetails({
  profile,
  info,
  completion,
  cumulativeScore,
  attendance,
  onRevokeAccess,
}: StudentDetailsProps) {
  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <button
          onClick={onRevokeAccess}
          className="rounded-full bg-[#C62828] px-5 py-2 text-white font-medium"
        >
          Revoke Access
        </button>
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <StudentProfileCard profile={profile} />

        <StudentInfoCard info={info} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <ProgressCard title="Student overall completion" data={completion} />

        <ProgressCard title="Student cumulative score" data={cumulativeScore} />
      </div>

      <AttendanceTable attendance={attendance} />
    </div>
  );
}

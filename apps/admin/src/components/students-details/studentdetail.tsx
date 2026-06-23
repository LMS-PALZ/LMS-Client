"use client";

import { StudentProfileCard } from "@/components/students-details/ProfileCard";
import { StudentInfoCard } from "@/components/students-details/StudentInfoCard";
import { ProgressCard } from "@/components/students-details/ProgressCard";
import { AttendanceTable } from "@/components/students-details/AttendanceTable";
import { Button } from "../../../../../packages/ui/src/atoms/Button/Button";
import type {
  StudentProfile,
  StudentInfo,
  ProgressData,
  AttendanceRecord,
} from "@ssu/types";

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
      <section className="flex justify-end">
        <div className="w-[220px]">
          <Button
            type="button"
            variant="danger"
            size="lg"
            className="w-full rounded-[30px] text-[var(--color-surface)]"
            onClick={onRevokeAccess}
          >
            Revoke Access
          </Button>
        </div>
      </section>

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

"use client";

import { StudentProfileCard } from "@/components/students-details/ProfileCard";
import { StudentInfoCard } from "@/components/students-details/StudentInfoCard";
import { AttendanceTable } from "@/components/students-details/AttendanceTable";
import { Button } from "@ssu/ui";
import type {
  StudentProfile,
  StudentInfo,
  ProgressData,
  AttendanceRecord,
} from "@ssu/types";
import { useUpdateStudentStatusMutation } from "@ssu/queries";

export interface StudentDetailsProps {
  profile: StudentProfile;
  info: StudentInfo;
  completion: ProgressData;
  cumulativeScore: ProgressData;
  attendance: AttendanceRecord[];
  userId: string;
  onRevokeAccess?: () => void;
}

export function StudentDetails({
  profile,
  info,
  attendance,
  userId,
}: StudentDetailsProps) {
  const updateStudentStatus = useUpdateStudentStatusMutation();

  const handleRevokeAccess = async () => {
    await updateStudentStatus.mutateAsync({ userId, status: "suspended" });
  };

  return (
    <div className="space-y-5">
      <section className="flex justify-end">
        <div className="w-[220px]">
          <Button
            type="button"
            variant="danger"
            size="lg"
            className="w-full rounded-[30px] text-[var(--color-surface)]"
            onClick={handleRevokeAccess}
          >
            Revoke Access
          </Button>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <StudentProfileCard profile={profile} />
        <StudentInfoCard info={info} />
      </div>

      <AttendanceTable attendance={attendance} />
    </div>
  );
}

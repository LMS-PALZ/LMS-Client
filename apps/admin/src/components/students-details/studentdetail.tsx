"use client";

import { StudentProfileCard } from "@/components/students-details/ProfileCard";
import { StudentInfoCard } from "@/components/students-details/StudentInfoCard";
import { AttendanceTable } from "@/components/students-details/AttendanceTable";
import { Button } from "@ssu/ui";
import { Loader2 } from "lucide-react";
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

  const status = profile?.status === "active" ? "suspended" : "active";

  const ChangeStatus = async () => {
    await updateStudentStatus.mutateAsync({ userId, status });
  };

  return (
    <div className="space-y-5">
      <section className="flex justify-end">
        <div className="w-[220px]">
          <Button
            type="button"
            variant={profile?.status === "active" ? "danger" : "primary"}
            size="lg"
            className="w-full rounded-[30px] text-[var(--color-surface)]"
            onClick={ChangeStatus}
            disabled={updateStudentStatus.isPending}
          >
            {updateStudentStatus.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {profile?.status === "active" ? "Revoking..." : "Activating..."}
              </span>
            ) : profile?.status === "active" ? (
              "Revoke Access"
            ) : (
              "Activate Student"
            )}
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

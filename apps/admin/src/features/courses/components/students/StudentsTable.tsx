import type { ProgramApplicant } from "@ssu/types";
import { cn } from "@ssu/utils";
import {
  getAvatarColorFromId,
  getInitialsFromName,
} from "../../lib/avatar-utils";
import { formatCourseListDate } from "../../lib/course-utils";
import { mapApplicantStatus } from "../../lib/student-utils";
import { StudentStatusBadge } from "./StudentStatusBadge";

interface StudentsTableProps {
  applicants: ProgramApplicant[];
  cohortName?: string;
}

export function StudentsTable({ applicants, cohortName }: StudentsTableProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#EEF2F6]">
      <table className="w-full text-left">
        <thead className="bg-[#F7F9FB] text-[13px] text-[#6B7280]">
          <tr>
            <th className="px-5 py-3 font-medium">Students</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Cohort</th>
            <th className="px-5 py-3 font-medium">Enrollment date</th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => {
            const status = mapApplicantStatus(applicant.status);
            return (
              <tr
                key={applicant.id}
                className="border-t border-[#EEF2F6] text-[14px] text-[#1D1D1D]"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold",
                        getAvatarColorFromId(applicant.id),
                      )}
                    >
                      {getInitialsFromName(applicant.studentName)}
                    </div>
                    <span className="font-medium">{applicant.studentName}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <StudentStatusBadge status={status} />
                </td>
                <td className="px-5 py-4 text-[#6B7280]">
                  {cohortName ?? "—"}
                </td>
                <td className="px-5 py-4 text-[#6B7280]">
                  {formatCourseListDate(applicant.createdAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

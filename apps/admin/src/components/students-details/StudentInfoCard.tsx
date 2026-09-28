import type { StudentInfo } from "@ssu/types";
import { displayValue, EMPTY_DISPLAY } from "@ssu/utils";

interface StudentInfoCardProps {
  info: StudentInfo;
}

function formatEnrollmentDate(value?: string | null): string {
  if (!value?.trim()) return EMPTY_DISPLAY;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return EMPTY_DISPLAY;
  return date.toLocaleDateString("en-GB");
}

function formatPercent(value?: number | null): string {
  if (value == null || Number.isNaN(Number(value))) return EMPTY_DISPLAY;
  return `${Number(value)}%`;
}

function formatOverallCompletion(
  week?: number | null,
  totalWeeks?: number | null,
): string {
  if (week == null || totalWeeks == null) return EMPTY_DISPLAY;
  return `Week ${week} of ${totalWeeks}`;
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-md text-[13px]">{label}</p>
      <p className="mt-2 text-[13px] font-medium text-[#7B8794]">{value}</p>
    </div>
  );
}

export function StudentInfoCard({ info }: StudentInfoCardProps) {
  return (
    <div className="rounded-[24px] border border-[#E6EBF0] bg-[#F8FAF8] p-8">
      <div className="grid gap-8 md:grid-cols-3">
        <InfoField
          label="Progress"
          value={formatPercent(info?.progressPercent)}
        />
        <InfoField
          label="Overall completion"
          value={formatOverallCompletion(
            info?.overallCompletion?.week,
            info?.overallCompletion?.totalWeeks,
          )}
        />
        <InfoField
          label="Cumulative score"
          value={formatPercent(info?.cumulativeScore)}
        />
        <InfoField label="Email address" value={displayValue(info?.email)} />
        <InfoField
          label="Phone number"
          value={displayValue(info?.phoneNumber)}
        />
        <InfoField label="Cohort" value={displayValue(info?.cohortName)} />
        <InfoField
          label="Date registered"
          value={formatEnrollmentDate(info?.enrollmentDate)}
        />
      </div>
    </div>
  );
}

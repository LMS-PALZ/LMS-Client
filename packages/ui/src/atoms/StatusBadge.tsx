"use client";

import type { ReactNode } from "react";

interface Props {
  status: string;
  children?: ReactNode;
}

export function StatusBadge({ status }: Props) {
  const styles: Record<string, string> = {
    "Good standing": "bg-[#DFF2E1] text-[#2E7D32]",
    flagged: "bg-[#FDE2DF] text-[#D32F2F]",
    active: "bg-[#DBF1DC] text-[#1F6E2A]",
    invited: "bg-[#CDE5FE] text-[#2563EB]",
    suspended: "bg-[#FFDFC5] text-[#F49221]",
    draft: "bg-[#FFDFC5] text-[#F49221]",
    published: "bg-[#DBF1DC] text-[#1F6E2A]",
    "pending review": "bg-[#FFE0C5] text-[#F49220]",
    "pending-review": "bg-[#FFE0C5] text-[#F49220]",
    pendingReview: "bg-[#FFE0C5] text-[#F49220]",
    graded: "bg-[#D4EDDA] text-[#2D6A4F]",
    closed: "bg-[#E2E8F0] text-[#475569]",
    archive: "bg-[#E2E8F0] text-[#475569]",
    archived: "bg-[#E2E8F0] text-[#475569]",
    "not-submitted": "bg-[#FEE8E8] text-[#DC2626]",
    notSubmitted: "bg-[#FEE8E8] text-[#DC2626]",
    returned: "bg-[#E0F2FE] text-[#2563EB]",
    overdue: "bg-[#FEE8E8] text-[#DC2626]",
    "access-revoked": "bg-[#E9EEF5] text-[#5F6B7A]",
    awaiting: "bg-[#E2E8F0] text-[#535A61]",
  };

  const labels: Record<string, string> = {
    "Good standing": "Good standing",
    flagged: "Flagged",
    active: "Active",
    invited: "Invited",
    suspended: "Suspended",
    draft: "Draft",
    published: "Published",
    "pending review": "Pending review",
    "pending-review": "Pending review",
    pendingReview: "Pending review",
    graded: "Graded",
    closed: "Closed",
    archive: "Archived",
    archived: "Archived",
    "not-submitted": "Not submitted",
    notSubmitted: "Not submitted",
    returned: "Returned",
    overdue: "Overdue",
    awaiting: "Awaiting",
    "access-revoked": "Access revoked",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        styles[status] ?? "bg-neutral-100 text-neutral-700"
      }`}
    >
      {labels[status] ?? String(status)}
    </span>
  );
}

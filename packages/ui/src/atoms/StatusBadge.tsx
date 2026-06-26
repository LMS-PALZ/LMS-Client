"use client";

import { Status } from "@ssu/types";

interface Props {
  status: Status;
}

export function StatusBadge({ status }: Props) {
  const styles = {
    "Good standing": "bg-[#DFF2E1] text-[#2E7D32]",

    flagged: "bg-[#FDE2DF] text-[#D32F2F]",

    active: "bg-[#DBF1DC] text-[#1F6E2A]",

    invited: "bg-[#CDE5FE] text-[#2563EB]",

    suspended: "bg-[#FFDFC5] text-[#F49221]",

    "access-revoked": "bg-[#E9EEF5] text-[#5F6B7A]",
  };

  const labels = {
    "Good standing": "Good standing",
    flagged: "Flagged",
    active: "Active",
    invited: "Invited",
    suspended: "Suspended",
    "access-revoked": "Access revoked",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

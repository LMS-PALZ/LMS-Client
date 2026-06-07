"use client";

import { StudentStatus } from "@ssu/types";

interface Props {
  status: StudentStatus;
}

export function StatusBadge({ status }: Props) {
  const styles = {
    "good-standing": "bg-[#DFF2E1] text-[#2E7D32]",

    flagged: "bg-[#FDE2DF] text-[#D32F2F]",

    "access-revoked": "bg-[#E9EEF5] text-[#5F6B7A]",
  };

  const labels = {
    "good-standing": "Good standing",

    flagged: "Flagged",

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

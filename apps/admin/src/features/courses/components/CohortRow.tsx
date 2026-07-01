"use client";

import { X } from "lucide-react";
import type { Cohort } from "../types";
import { calculateDurationLabel, formatDateRange } from "../lib/course-utils";

interface CohortRowProps {
  cohort: Cohort;
  index: number;
  onRemove: () => void;
}

export function CohortRow({ cohort, index, onRemove }: CohortRowProps) {
  const start = new Date(cohort.startDate);
  const end = new Date(cohort.endDate);
  const duration = calculateDurationLabel(start, end);

  return (
    <div className="flex items-center justify-between rounded-[12px] bg-[#F7F9FB] px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 text-[14px]">
        <span className="rounded-md bg-[#D1EFE0] px-2.5 py-1 text-[12px] font-medium text-[#4C7D5B]">
          Cohort {index + 1}
        </span>
        <span className="text-[#1D1D1D]">
          {formatDateRange(cohort.startDate, cohort.endDate)}
        </span>
        <span className="text-[#94A3B8]">({duration})</span>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#94A3B8] transition hover:bg-[#ECF0F6] hover:text-[#1D1D1D]"
        aria-label={`Remove ${cohort.name}`}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

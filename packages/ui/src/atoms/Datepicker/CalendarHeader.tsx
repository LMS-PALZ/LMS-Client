"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
  month: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export function CalendarHeader({
  month,
  onPrevious,
  onNext,
}: CalendarHeaderProps) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <button
        type="button"
        onClick={onPrevious}
        className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#F3F4F6]"
      >
        <ChevronLeft className="h-6 w-6 text-black" />
      </button>

      <h2 className="text-xl font-semibold text-[#111827]">
        {format(month, "MMMM yyyy")}
      </h2>

      <button
        type="button"
        onClick={onNext}
        className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-[#F3F4F6]"
      >
        <ChevronRight className="h-6 w-6 text-black" />
      </button>
    </div>
  );
}

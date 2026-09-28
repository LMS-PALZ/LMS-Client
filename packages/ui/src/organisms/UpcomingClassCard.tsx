"use client";

import { ChevronRight } from "lucide-react";

interface UpcomingClassCardProps {
  title: string;
  time: string;
  date: string;
  programName: string;
  onOpen?: () => void;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function UpcomingClassCard({
  title,
  time,
  date,
  programName,
  onOpen,
}: UpcomingClassCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.()}
      className="group flex w-full items-center gap-3 rounded-2xl border border-[#EEF2F6] bg-[#FAFBFC] px-4 py-3.5 text-left transition hover:border-[#D4E2D8] hover:bg-white"
    >
      <span className="shrink-0 rounded-full bg-[#DBEAFE] px-3 py-1 text-[12px] font-medium text-[#2563EB]">
        Upcoming
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium text-[#1D1D1D]">
          {programName}
          <span className="font-normal text-[#6B7280]"> · {title}</span>
        </p>
        <p className="mt-0.5 text-[12px] text-[#6B7280]">
          {time} · {formatDate(date)}
        </p>
      </div>

      <ChevronRight
        className="h-4 w-4 shrink-0 text-[#94A3B8] transition group-hover:text-[#4E845F]"
        aria-hidden
      />
    </button>
  );
}

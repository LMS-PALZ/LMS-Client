"use client";

import { CalendarIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { CalendarGrid } from "./CalendarGrid";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarWeekdays } from "./CalendarWeekdays";
import type { DatePickerProps } from "./types";
import {
  formatDate,
  getCalendarDays,
  previousMonth,
  nextMonth,
} from "./calendar-utils";

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  disabled = false,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handleOutside);

    return () => window.removeEventListener("mousedown", handleOutside);
  }, []);

  const selectedDate = value
    ? (() => {
        const [day, month, year] = value.split("/").map(Number);

        return new Date(year, month - 1, day);
      })()
    : undefined;

  const [month, setMonth] = useState(() => {
    if (selectedDate) {
      return new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    }

    return new Date();
  });

  const days = getCalendarDays(month);

  return (
    <div ref={ref} className="relative w-full">
      <button
        disabled={disabled}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center rounded-xl border border-[#CBD5E1] bg-white px-4"
      >
        <CalendarIcon className="mr-3 h-5 w-5 text-[#94A3B8]" />

        <span className={value ? "text-[#1F2937]" : "text-[#94A3B8]"}>
          {selectedDate
            ? selectedDate.toLocaleDateString("en-GB", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+12px)] z-50 w-[390px] rounded-[28px] border border-[#E5E7EB] bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
          <CalendarHeader
            month={month}
            onPrevious={() => setMonth(previousMonth(month))}
            onNext={() => setMonth(nextMonth(month))}
          />

          <CalendarWeekdays />

          <CalendarGrid
            days={days}
            selectedDate={selectedDate}
            onSelect={(date) => {
              onChange?.(formatDate(date));
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

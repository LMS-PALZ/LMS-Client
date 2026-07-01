"use client";

import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@ssu/utils";
import { formatDateDDMMYYYY } from "../lib/course-utils";
import "./cohort-date-picker.css";

interface CohortDatePickerProps {
  id: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  className?: string;
  /** Align popover to the right edge of the trigger (use for right-column fields). */
  popoverAlign?: "start" | "end";
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBeforeDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

function getMonthGrid(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];

  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push(new Date(year, month, day));
  }

  return cells;
}

interface MonthCalendarProps {
  value: Date | null;
  minDate?: Date;
  onSelect: (date: Date) => void;
}

function MonthCalendar({ value, minDate, onSelect }: MonthCalendarProps) {
  const today = startOfDay(new Date());
  const initialMonth = value ?? today;
  const [viewYear, setViewYear] = useState(initialMonth.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialMonth.getMonth());
  const selectedDayMs = value ? value.getTime() : null;

  useEffect(() => {
    if (selectedDayMs === null) return;

    const selectedDate = new Date(selectedDayMs);
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDayMs]);

  const cells = getMonthGrid(viewYear, viewMonth);

  return (
    <div className="cohort-date-picker__panel">
      <div className="cohort-date-picker__header">
        <button
          type="button"
          onClick={() => {
            if (viewMonth === 0) {
              setViewMonth(11);
              setViewYear((year) => year - 1);
              return;
            }
            setViewMonth((month) => month - 1);
          }}
          className="cohort-date-picker__nav"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <p className="cohort-date-picker__title">
          {MONTHS[viewMonth]} {viewYear}
        </p>
        <button
          type="button"
          onClick={() => {
            if (viewMonth === 11) {
              setViewMonth(0);
              setViewYear((year) => year + 1);
              return;
            }
            setViewMonth((month) => month + 1);
          }}
          className="cohort-date-picker__nav"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="cohort-date-picker__weekdays">
        {WEEKDAYS.map((day) => (
          <span key={day} className="cohort-date-picker__weekday">
            {day}
          </span>
        ))}
      </div>

      <div className="cohort-date-picker__grid">
        {cells.map((date, index) => {
          if (!date) {
            return (
              <span
                key={`empty-${index}`}
                className="cohort-date-picker__day cohort-date-picker__day--empty"
                aria-hidden
              />
            );
          }

          const disabled = minDate ? isBeforeDay(date, minDate) : false;
          const selected = value ? isSameDay(date, value) : false;
          const isToday = isSameDay(date, today);

          return (
            <button
              key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(startOfDay(date))}
              className={cn(
                "cohort-date-picker__day",
                selected && "cohort-date-picker__day--selected",
                isToday && !selected && "cohort-date-picker__day--today",
                disabled && "cohort-date-picker__day--disabled",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function CohortDatePicker({
  id,
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  minDate,
  className,
  popoverAlign = "start",
}: CohortDatePickerProps) {
  const fallbackId = useId();
  const fieldId = id || fallbackId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const closeCalendar = () => {
    setOpen(false);
  };

  const handleSelect = (date: Date) => {
    onChange(date);
    closeCalendar();
  };

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) {
        return;
      }
      closeCalendar();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn("relative", open ? "z-[100]" : "z-10", className)}
    >
      <button
        id={fieldId}
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-12 w-full cursor-pointer items-center gap-3 rounded-[12px] border border-neutral-200 bg-white px-3 text-left text-body transition-colors hover:border-[#94A3B8]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
          value ? "text-[#1D1D1D]" : "text-neutral-400",
        )}
      >
        <Calendar className="h-4 w-4 shrink-0 text-[#94A3B8]" aria-hidden />
        <span className="truncate">
          {value ? formatDateDDMMYYYY(value) : placeholder}
        </span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full z-[60] mt-2 w-[288px] rounded-[14px] border border-[#EEF2F6] bg-white p-3 shadow-xl",
            popoverAlign === "end" ? "right-0" : "left-0",
          )}
        >
          <MonthCalendar
            value={value}
            minDate={minDate}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

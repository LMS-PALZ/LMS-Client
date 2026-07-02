"use client";

import { Clock } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@ssu/utils";
import "./time-picker.css";

export interface TimePickerProps {
  id: string;
  value: string | null;
  onChange: (time: string | null) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  popoverAlign?: "start" | "end";
  minuteStep?: number;
}

const HOURS = Array.from({ length: 24 }, (_, index) => index);

function buildMinutes(step: number): number[] {
  const minutes: number[] = [];
  for (let minute = 0; minute < 60; minute += step) {
    minutes.push(minute);
  }
  return minutes;
}

function parseTimeValue(value: string | null): {
  hours: number;
  minutes: number;
} | null {
  if (!value) return null;
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return { hours, minutes };
}

function formatTimeValue(hours: number, minutes: number): string {
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function snapMinute(minute: number, step: number): number {
  return Math.min(Math.round(minute / step) * step, 60 - step);
}

interface TimePickerPanelProps {
  value: string | null;
  minuteStep: number;
  onSelect: (time: string) => void;
}

function TimePickerPanel({
  value,
  minuteStep,
  onSelect,
}: TimePickerPanelProps) {
  const parsed = parseTimeValue(value);
  const minutes = buildMinutes(minuteStep);
  const [hours, setHours] = useState(parsed?.hours ?? 9);
  const [selectedMinutes, setSelectedMinutes] = useState(() => {
    if (parsed) return snapMinute(parsed.minutes, minuteStep);
    return minutes.includes(0) ? 0 : minutes[0];
  });

  useEffect(() => {
    const nextParsed = parseTimeValue(value);
    if (!nextParsed) return;
    setHours(nextParsed.hours);
    setSelectedMinutes(snapMinute(nextParsed.minutes, minuteStep));
  }, [value, minuteStep]);

  const handleMinuteSelect = (minute: number) => {
    setSelectedMinutes(minute);
    onSelect(formatTimeValue(hours, minute));
  };

  return (
    <div className="time-picker__panel">
      <div className="time-picker__column">
        <p className="time-picker__column-title">Hour</p>
        <div className="time-picker__list">
          {HOURS.map((hour) => (
            <button
              key={hour}
              type="button"
              onClick={() => setHours(hour)}
              className={cn(
                "time-picker__option",
                hours === hour && "time-picker__option--selected",
              )}
            >
              {String(hour).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>

      <div className="time-picker__column">
        <p className="time-picker__column-title">Minute</p>
        <div className="time-picker__list">
          {minutes.map((minute) => (
            <button
              key={minute}
              type="button"
              onClick={() => handleMinuteSelect(minute)}
              className={cn(
                "time-picker__option",
                selectedMinutes === minute && "time-picker__option--selected",
              )}
            >
              {String(minute).padStart(2, "0")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TimePicker({
  id,
  value,
  onChange,
  placeholder = "HH:MM",
  className,
  buttonClassName,
  popoverAlign = "start",
  minuteStep = 1,
}: TimePickerProps) {
  const fallbackId = useId();
  const fieldId = id || fallbackId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const closePicker = () => {
    setOpen(false);
  };

  const handleSelect = (time: string) => {
    onChange(time);
    closePicker();
  };

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) {
        return;
      }
      closePicker();
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
          buttonClassName,
        )}
      >
        <Clock className="h-4 w-4 shrink-0 text-[#94A3B8]" aria-hidden />
        <span className="truncate">{value ?? placeholder}</span>
      </button>

      {open && (
        <div
          className={cn(
            "absolute top-full z-[60] mt-2 w-[220px] rounded-[14px] border border-[#EEF2F6] bg-white p-3 shadow-xl",
            popoverAlign === "end" ? "right-0" : "left-0",
          )}
        >
          <TimePickerPanel
            value={value}
            minuteStep={minuteStep}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

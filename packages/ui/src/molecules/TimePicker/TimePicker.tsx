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

function buildTimeOptions(step: number): string[] {
  const safeStep = Math.min(Math.max(step, 1), 60);
  const options: string[] = [];
  for (let hours = 0; hours < 24; hours += 1) {
    for (let minutes = 0; minutes < 60; minutes += safeStep) {
      options.push(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`,
      );
    }
  }
  return options;
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
  const options = buildTimeOptions(minuteStep);

  return (
    <div className="time-picker__list">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className={cn(
            "time-picker__option",
            value === option && "time-picker__option--selected",
          )}
        >
          {option}
        </button>
      ))}
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
  minuteStep = 15,
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
            "absolute top-full z-[60] mt-2 w-[220px] rounded-[14px] border border-[#EEF2F6] bg-white p-2 shadow-xl",
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

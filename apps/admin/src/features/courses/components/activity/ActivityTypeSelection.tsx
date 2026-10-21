"use client";

import { useState } from "react";
import { cn } from "@ssu/utils";
import {
  ACTIVITY_SESSION_OPTIONS,
  type ActivitySessionMode,
} from "../../lib/activity-config";

const DEFAULT_SELECTED = ACTIVITY_SESSION_OPTIONS[0]?.id ?? "live_class";

interface ActivityTypeSelectionProps {
  onSelect: (mode: ActivitySessionMode) => void;
}

export function ActivityTypeSelection({
  onSelect,
}: ActivityTypeSelectionProps) {
  const [selectedId, setSelectedId] =
    useState<ActivitySessionMode>(DEFAULT_SELECTED);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[20px] font-semibold text-[#1D1D1D]">
          Choose content to add
        </h2>
        <p className="mt-1 text-[14px] text-[#64748B]">
          Pick a live Zoom class or a pre-recorded video. You can add reading
          notes inside either session.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ACTIVITY_SESSION_OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = selectedId === option.id;

          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setSelectedId(option.id);
                onSelect(option.id);
              }}
              className={cn(
                "flex flex-col items-start gap-3 rounded-2xl border p-5 text-left transition",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4C7D5B]",
                selected
                  ? "border-[#4C7D5B] bg-[#F4FBF6] shadow-[0_0_0_1px_rgba(76,125,91,0.35)] motion-safe:animate-live-breathe motion-reduce:animate-none"
                  : "border-[#E2E8F0] bg-white hover:border-[#4C7D5B] hover:bg-[#F4FBF6]",
              )}
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl",
                  selected
                    ? "bg-[#4C7D5B] text-white"
                    : "bg-[#E8F3EC] text-[#4C7D5B]",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex items-center gap-2 text-[16px] font-semibold text-[#1D1D1D]">
                {option.label}
                {selected ? (
                  <span className="rounded-full bg-[#E8F3EC] px-2 py-0.5 text-[11px] font-medium text-[#4C7D5B]">
                    Selected
                  </span>
                ) : null}
              </span>
              <span className="text-[13px] leading-relaxed text-[#64748B]">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

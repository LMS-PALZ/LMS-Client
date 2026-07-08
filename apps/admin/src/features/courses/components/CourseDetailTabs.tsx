"use client";

import { cn } from "@ssu/utils";
import type { CourseDetailTab } from "../types/ui";

interface CourseDetailTabsProps {
  value: CourseDetailTab;
  onChange: (value: CourseDetailTab) => void;
}

const TABS: { id: CourseDetailTab; label: string }[] = [
  { id: "students", label: "Students" },
  { id: "modules", label: "Modules" },
  { id: "cohorts", label: "Cohorts" },
];

export function CourseDetailTabs({ value, onChange }: CourseDetailTabsProps) {
  return (
    <div className="flex gap-8 border-b border-[#EEF2F6]">
      {TABS.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative pb-3 text-[14px] font-medium transition-colors",
              active ? "text-[#4C7D5B]" : "text-[#6B7280] hover:text-[#1D1D1D]",
            )}
          >
            {tab.label}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-[#4C7D5B]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import type { ClassroomLessonType } from "@ssu/types";
import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ActivityTypeOption {
  id: ClassroomLessonType;
  label: string;
  icon: LucideIcon;
}

interface CourseActivityShellProps {
  activityType: ClassroomLessonType;
  activityTypes: ActivityTypeOption[];
  onActivityTypeChange: (type: ClassroomLessonType) => void;
  children: ReactNode;
  disableTypeSwitch?: boolean;
}

export function CourseActivityShell({
  activityType,
  activityTypes,
  onActivityTypeChange,
  children,
  disableTypeSwitch = false,
}: CourseActivityShellProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-[#D7DFEA] bg-white shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="grid lg:grid-cols-[240px_1fr]">
        <aside className="border-b border-[#EEF2F6] bg-[#FAFBFC] p-6 lg:border-b-0 lg:border-r">
          <p className="mb-4 text-[14px] font-semibold text-[#1D1D1D]">
            Choose content to add
          </p>
          <div className="space-y-3">
            {activityTypes.map((item) => {
              const Icon = item.icon;
              const active = activityType === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  disabled={disableTypeSwitch && !active}
                  onClick={() => onActivityTypeChange(item.id)}
                  className={cn(
                    "flex w-full flex-col items-center gap-2 rounded-[12px] border-2 px-4 py-5 transition",
                    active
                      ? "border-[#4C7D5B] bg-[#E8F3EC]"
                      : "border-[#D7DFEA] bg-white hover:border-[#C5D6CB] hover:bg-[#F7F9FB]",
                    disableTypeSwitch &&
                      !active &&
                      "cursor-not-allowed opacity-50 hover:border-[#D7DFEA] hover:bg-white",
                  )}
                >
                  <Icon className="h-6 w-6 text-[#4C7D5B]" />
                  <span className="text-[14px] font-medium text-[#1D1D1D]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-6 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

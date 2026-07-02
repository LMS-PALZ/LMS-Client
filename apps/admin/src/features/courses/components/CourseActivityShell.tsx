"use client";

import { cn } from "@ssu/utils";
import type { CourseActivityShellProps } from "../types/activity";

export function CourseActivityShell({
  activityType,
  activityTypes,
  onActivityTypeChange,
  children,
  disableTypeSwitch = false,
}: CourseActivityShellProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
      <div className="flex flex-col lg:flex-row">
        <aside className="w-full shrink-0 border-b border-[#EEF2F6] p-6 lg:w-[272px] lg:border-b-0 lg:border-r">
          <p className="mb-4 text-[14px] font-semibold text-[#1D1D1D]">
            Choose content to add
          </p>
          <div className="flex flex-wrap gap-5">
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
                    "flex h-[88px] w-[88px] shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-3 transition",
                    active
                      ? "border border-[#4C7D5B] bg-[#E8F3EC]"
                      : "border-0 bg-[#EFF2F5]",
                    disableTypeSwitch &&
                      !active &&
                      "cursor-not-allowed opacity-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      active ? "text-[#4C7D5B]" : "text-[#64748B]",
                    )}
                  />
                  <span className="text-center text-[12px] font-medium leading-tight text-[#1D1D1D]">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="min-w-0 flex-1 space-y-5 p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}

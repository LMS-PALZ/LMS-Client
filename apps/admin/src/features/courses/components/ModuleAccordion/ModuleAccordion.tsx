"use client";

import { cn } from "@ssu/utils";
import type { ModuleAccordionProps } from "../../types/activity";
import { AddItemLink } from "../AddItemLink";
import { ActivityList } from "./ActivityList";
import { ModuleHeader } from "./ModuleHeader";

export function ModuleAccordion({
  modules,
  expandedModuleId,
  onToggleModule,
  mode = "view",
  onEditModule,
  onDeleteModule,
  onEditActivity,
  onDeleteActivity,
  onAddActivity,
}: ModuleAccordionProps) {
  const isEdit = mode === "edit";

  return (
    <div className="overflow-hidden rounded-[14px] bg-[#EEF2F6]">
      {modules.map((module, index) => {
        const expanded = expandedModuleId === module.id;
        const lessons = module.lessons ?? [];
        const isLast = index === modules.length - 1;

        return (
          <div
            key={module.id}
            className={cn(!isLast && "border-b border-[#E2E8F0]")}
          >
            <ModuleHeader
              module={module}
              expanded={expanded}
              lessons={lessons}
              mode={mode}
              onToggleModule={onToggleModule}
              onEditModule={onEditModule}
              onDeleteModule={onDeleteModule}
            />

            {expanded && (
              <div className="border-t border-[#E2E8F0] bg-white px-5 py-4">
                {lessons.length === 0 && !isEdit ? (
                  <p className="text-[14px] text-[#94A3B8]">
                    No activities yet.
                  </p>
                ) : null}

                {lessons.length > 0 && (
                  <div className={cn(isEdit && onAddActivity && "mb-3")}>
                    <ActivityList
                      module={module}
                      lessons={lessons}
                      mode={mode}
                      onEditActivity={onEditActivity}
                      onDeleteActivity={onDeleteActivity}
                    />
                  </div>
                )}

                {isEdit && onAddActivity && (
                  <AddItemLink
                    label="Add activity"
                    onClick={() => onAddActivity(module)}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

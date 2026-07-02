"use client";

import type { ProgramClassroomModule } from "@ssu/types";
import { Spinner } from "@ssu/ui";
import { useExpandedModule } from "../hooks/use-expanded-module";
import {
  countTotalLessons,
  formatModuleSummary,
} from "../lib/classroom-mappers";
import { ModuleAccordion } from "./ModuleAccordion";

interface CourseModulesTabProps {
  modules: ProgramClassroomModule[];
  isLoading?: boolean;
  error?: string | null;
}

export function CourseModulesTab({
  modules,
  isLoading = false,
  error = null,
}: CourseModulesTabProps) {
  const { expandedModuleId, toggleModule } = useExpandedModule(modules);

  if (isLoading) {
    return (
      <div className="flex min-h-[280px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-[14px] text-[#94A3B8]">
        {error}
      </div>
    );
  }

  if (modules.length === 0) {
    return (
      <div className="flex min-h-[280px] items-center justify-center text-[14px] text-[#94A3B8]">
        No modules have been added to this course yet.
      </div>
    );
  }

  const totalLessons = countTotalLessons(modules);

  return (
    <div className="space-y-4">
      <p className="text-[14px] font-medium text-[#1D1D1D]">
        {formatModuleSummary(modules.length, totalLessons)}
      </p>
      <ModuleAccordion
        modules={modules}
        expandedModuleId={expandedModuleId}
        onToggleModule={toggleModule}
        mode="view"
      />
    </div>
  );
}

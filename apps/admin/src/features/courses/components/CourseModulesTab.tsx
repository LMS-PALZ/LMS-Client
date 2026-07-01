"use client";

import { useEffect, useState } from "react";
import type { ProgramClassroomModule } from "@ssu/types";
import { Spinner } from "@ssu/ui";
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
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  useEffect(() => {
    if (modules.length > 0 && !expandedModuleId) {
      setExpandedModuleId(modules[0].id);
    }
  }, [modules, expandedModuleId]);

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
        onToggleModule={(moduleId) =>
          setExpandedModuleId((current) =>
            current === moduleId ? null : moduleId,
          )
        }
        mode="view"
      />
    </div>
  );
}

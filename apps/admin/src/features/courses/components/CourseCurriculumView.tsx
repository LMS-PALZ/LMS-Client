"use client";

import type { AdminProgram, ProgramClassroomModule } from "@ssu/types";
import { Spinner } from "@ssu/ui";
import { AddItemLink } from "./AddItemLink";
import { CourseModuleRow } from "./CourseModuleRow";

interface CourseCurriculumViewProps {
  program: AdminProgram;
  modules: ProgramClassroomModule[];
  isLoadingModules?: boolean;
  modulesError?: string | null;
}

export function CourseCurriculumView({
  program,
  modules,
  isLoadingModules = false,
  modulesError = null,
}: CourseCurriculumViewProps) {
  const hasModules = modules.length > 0;

  if (isLoadingModules) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (modulesError) {
    return (
      <div className="mx-auto flex min-h-[280px] w-full max-w-[640px] flex-col items-center justify-center text-center">
        <p className="text-[16px] font-semibold text-[#1D1D1D]">
          Could not load modules
        </p>
        <p className="mt-2 max-w-sm text-[14px] text-[#94A3B8]">
          {modulesError}
        </p>
      </div>
    );
  }

  if (!hasModules) {
    return (
      <div className="mx-auto flex min-h-[320px] w-full max-w-[640px] flex-col items-center justify-center text-center">
        <p className="mb-2 text-[14px] font-medium text-[#94A3B8]">
          {program.title}
        </p>
        <p className="text-[16px] font-semibold text-[#1D1D1D]">
          Start building your course
        </p>
        <div className="mt-4">
          <AddItemLink label="Add module" onClick={() => undefined} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[640px] space-y-5">
      <div>
        <p className="text-[14px] font-medium text-[#94A3B8]">
          {program.title}
        </p>
        <h2 className="mt-1 text-[18px] font-semibold text-[#1D1D1D]">
          Modules
        </h2>
        {program.description && (
          <p className="mt-2 text-[14px] leading-6 text-[#6B7280]">
            {program.description}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {modules.map((module, index) => (
          <CourseModuleRow key={module.id} module={module} index={index} />
        ))}
      </div>

      <AddItemLink label="Add module" onClick={() => undefined} />
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import type {
  AdminProgram,
  ClassroomLessonType,
  ProgramClassroomModule,
} from "@ssu/types";
import { Spinner } from "@ssu/ui";
import { useExpandedModule } from "../hooks/use-expanded-module";
import { createId } from "../lib/course-utils";
import type { PendingLessonDelete } from "../types/activity";
import { AddItemLink } from "./AddItemLink";
import { ActivityDeletedModal } from "./DeleteActivityModal";
import { AddModuleModal } from "./AddModuleModal";
import { DeleteActivityModal } from "./DeleteActivityModal";
import { ModuleAccordion } from "./ModuleAccordion";

interface CourseCurriculumViewProps {
  program: AdminProgram;
  modules: ProgramClassroomModule[];
  isLoadingModules?: boolean;
  modulesError?: string | null;
  isSaving?: boolean;
  onSaveModules: (modules: ProgramClassroomModule[]) => Promise<void>;
}

export function CourseCurriculumView({
  program,
  modules,
  isLoadingModules = false,
  modulesError = null,
  isSaving = false,
  onSaveModules,
}: CourseCurriculumViewProps) {
  const router = useRouter();
  const { expandedModuleId, setExpandedModuleId, toggleModule } =
    useExpandedModule(modules);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [deleteActivityOpen, setDeleteActivityOpen] = useState(false);
  const [deleteDoneOpen, setDeleteDoneOpen] = useState(false);
  const [pendingDelete, setPendingDelete] =
    useState<PendingLessonDelete | null>(null);

  const hasModules = modules.length > 0;

  const openAddModule = () => {
    setModuleModalOpen(true);
  };

  const openEditModule = (module: ProgramClassroomModule) => {
    goToActivity(module, "live_session");
  };

  const saveModule = async (title: string) => {
    const nextModules = [
      ...modules,
      {
        id: createId("temp-module"),
        title,
        weekLabel: `Week ${modules.length + 1}`,
        lessonCount: 0,
        lessons: [],
        order: modules.length + 1,
      },
    ];

    await onSaveModules(nextModules);
    setModuleModalOpen(false);
    setExpandedModuleId(nextModules[nextModules.length - 1]?.id ?? null);
  };

  const deleteModule = async (module: ProgramClassroomModule) => {
    const confirmed = window.confirm(
      `Delete module "${module.title}" and all its activities?`,
    );
    if (!confirmed) return;
    await onSaveModules(modules.filter((item) => item.id !== module.id));
  };

  const deleteActivity = async () => {
    if (!pendingDelete) return;

    const nextModules = modules.map((module) => {
      if (module.id !== pendingDelete.module.id) return module;
      const lessons = (module.lessons ?? []).filter(
        (lesson) => lesson.id !== pendingDelete.lesson.id,
      );
      return {
        ...module,
        lessons,
        lessonCount: lessons.length,
      };
    });

    await onSaveModules(nextModules);
    setDeleteActivityOpen(false);
    setPendingDelete(null);
    setDeleteDoneOpen(true);
  };

  const goToActivity = (
    module: ProgramClassroomModule,
    type: ClassroomLessonType,
    lessonId?: string,
  ) => {
    const params = new URLSearchParams({
      moduleId: module.id,
      type,
    });
    if (lessonId) params.set("lessonId", lessonId);
    router.push(
      adminPath(`/courses/${program.id}/activities/new?${params.toString()}`),
    );
  };

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
      <>
        <div className="mx-auto flex min-h-[320px] w-full max-w-[640px] flex-col items-center justify-center text-center">
          <p className="mb-2 text-[14px] font-medium text-[#94A3B8]">
            {program.title}
          </p>
          <p className="text-[16px] font-semibold text-[#1D1D1D]">
            Start building your course
          </p>
          <div className="mt-4">
            <AddItemLink label="Add module" onClick={openAddModule} />
          </div>
        </div>

        <AddModuleModal
          open={moduleModalOpen}
          onOpenChange={setModuleModalOpen}
          onSave={(name) => void saveModule(name)}
          isSaving={isSaving}
        />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[640px] space-y-4">
        <AddItemLink label="Add module" onClick={openAddModule} />

        <ModuleAccordion
          modules={modules}
          expandedModuleId={expandedModuleId}
          onToggleModule={toggleModule}
          mode="edit"
          onEditModule={openEditModule}
          onDeleteModule={(module) => void deleteModule(module)}
          onEditActivity={(module, lesson) =>
            goToActivity(module, lesson.lessonType, lesson.id)
          }
          onDeleteActivity={(module, lesson) => {
            setPendingDelete({ module, lesson });
            setDeleteActivityOpen(true);
          }}
          onAddActivity={(module) => goToActivity(module, "live_session")}
        />
      </div>

      <AddModuleModal
        open={moduleModalOpen}
        onOpenChange={setModuleModalOpen}
        onSave={(name) => void saveModule(name)}
        isSaving={isSaving}
      />

      <DeleteActivityModal
        open={deleteActivityOpen}
        onOpenChange={setDeleteActivityOpen}
        onConfirm={() => void deleteActivity()}
        isDeleting={isSaving}
      />

      <ActivityDeletedModal
        open={deleteDoneOpen}
        onOpenChange={setDeleteDoneOpen}
      />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import type {
  AdminProgram,
  ClassroomLessonType,
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import { AdminModuleListSkeleton } from "@/components/skeletons";
import { useExpandedModule } from "../hooks/use-expanded-module";
import { createId } from "../lib/course-utils";
import type { PendingLessonDelete } from "../types/activity";
import { AddItemLink } from "./AddItemLink";
import { AddModuleModal } from "./AddModuleModal";
import { DeleteActivityModal } from "./DeleteActivityModal";
// import { DeleteModuleModal } from "./DeleteModuleModal";
import { ModuleAccordion } from "./ModuleAccordion";

interface CourseCurriculumViewProps {
  program: AdminProgram;
  modules: ProgramClassroomModule[];
  isLoadingModules?: boolean;
  modulesError?: string | null;
  isSaving?: boolean;
  onSaveModule: (module: ProgramClassroomModule) => Promise<void>;
  onDeleteActivity: (
    module: ProgramClassroomModule,
    lesson: ProgramClassroomLesson,
  ) => Promise<void>;
}

export function CourseCurriculumView({
  program,
  modules,
  isLoadingModules = false,
  modulesError = null,
  isSaving = false,
  onSaveModule,
  onDeleteActivity,
}: CourseCurriculumViewProps) {
  const router = useRouter();
  const { expandedModuleId, setExpandedModuleId, toggleModule } =
    useExpandedModule(modules);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] =
    useState<ProgramClassroomModule | null>(null);
  const [deleteActivityOpen, setDeleteActivityOpen] = useState(false);
  const [pendingDelete, setPendingDelete] =
    useState<PendingLessonDelete | null>(null);

  const hasModules = modules.length > 0;

  const openAddModule = () => {
    setEditingModule(null);
    setModuleModalOpen(true);
  };

  const openEditModule = (module: ProgramClassroomModule) => {
    setEditingModule(module);
    setModuleModalOpen(true);
  };

  const closeModuleModal = (open: boolean) => {
    setModuleModalOpen(open);
    if (!open) setEditingModule(null);
  };

  const saveModule = async (title: string) => {
    if (editingModule) {
      await onSaveModule({
        ...editingModule,
        title,
      });
      setModuleModalOpen(false);
      setEditingModule(null);
      return;
    }

    const created: ProgramClassroomModule = {
      id: createId("temp-module"),
      title,
      weekLabel: `Week ${modules.length + 1}`,
      lessonCount: 0,
      lessons: [],
      order: modules.length + 1,
    };

    await onSaveModule(created);
    setModuleModalOpen(false);
    setExpandedModuleId(created.id);
  };

  const confirmDeleteActivity = async () => {
    if (!pendingDelete) return;
    await onDeleteActivity(pendingDelete.module, pendingDelete.lesson);
    setDeleteActivityOpen(false);
    setPendingDelete(null);
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
    return <AdminModuleListSkeleton />;
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
          onOpenChange={closeModuleModal}
          onSave={(name) => void saveModule(name)}
          initialName={editingModule?.title ?? ""}
          title={editingModule ? "Edit module" : "Add a module"}
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
        onOpenChange={closeModuleModal}
        onSave={(name) => void saveModule(name)}
        initialName={editingModule?.title ?? ""}
        title={editingModule ? "Edit module" : "Add a module"}
        isSaving={isSaving}
      />

      <DeleteActivityModal
        open={deleteActivityOpen}
        onOpenChange={(open) => {
          setDeleteActivityOpen(open);
          if (!open) setPendingDelete(null);
        }}
        onConfirm={() => void confirmDeleteActivity()}
        isDeleting={isSaving}
      />
    </>
  );
}

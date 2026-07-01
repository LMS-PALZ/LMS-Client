"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import {
  useAdminProgram,
  useProgramClassroomModules,
  useUpsertProgramClassroomMutation,
  mutationToast,
} from "@ssu/queries";
import type {
  ClassroomLessonType,
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import { AlertBanner, Button, Spinner } from "@ssu/ui";
import { FileText, Pencil, Radio } from "lucide-react";
import {
  ActivityDeletedModal,
  AddModuleModal,
  AddItemLink,
  DeleteActivityModal,
  ModuleAccordion,
} from "@/features/courses/components";
import { buildUpsertClassroomPayload } from "@/features/courses/lib/classroom-mappers";

interface CourseModuleEditPageProps {
  courseId: string;
  moduleId: string;
}

type PendingDelete = {
  module: ProgramClassroomModule;
  lesson: ProgramClassroomLesson;
};

const ACTIVITY_OPTIONS: {
  type: ClassroomLessonType;
  label: string;
  icon: typeof Radio;
}[] = [
  { type: "live_session", label: "Live Session", icon: Radio },
  { type: "reading", label: "Reading", icon: FileText },
];

export function CourseModuleEditPage({
  courseId,
  moduleId,
}: CourseModuleEditPageProps) {
  const router = useRouter();
  const { data: program, isLoading: isProgramLoading } =
    useAdminProgram(courseId);
  const {
    data: modules = [],
    isLoading: isModulesLoading,
    isError: isModulesError,
    error: modulesError,
  } = useProgramClassroomModules(courseId, Boolean(program?.id));
  const upsertClassroom = useUpsertProgramClassroomMutation();

  const module = useMemo(
    () => modules.find((item) => item.id === moduleId) ?? null,
    [modules, moduleId],
  );

  const [renameOpen, setRenameOpen] = useState(false);
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(
    moduleId,
  );
  const [deleteActivityOpen, setDeleteActivityOpen] = useState(false);
  const [deleteDoneOpen, setDeleteDoneOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null,
  );

  const isSaving = upsertClassroom.isPending;

  const saveModules = async (nextModules: ProgramClassroomModule[]) => {
    if (!program) return;
    await upsertClassroom.mutateAsync({
      programId: program.id,
      payload: buildUpsertClassroomPayload(
        program,
        nextModules,
        program.status === "published" ? "published" : "draft",
      ),
    });
  };

  const renameModule = async (title: string) => {
    if (!module) return;
    const nextModules = modules.map((item) =>
      item.id === module.id ? { ...item, title } : item,
    );
    try {
      await saveModules(nextModules);
      mutationToast.success("Module updated");
      setRenameOpen(false);
    } catch (error) {
      mutationToast.error(
        error instanceof Error ? error.message : "Failed to update module.",
      );
    }
  };

  const deleteActivity = async () => {
    if (!pendingDelete) return;
    const nextModules = modules.map((item) => {
      if (item.id !== pendingDelete.module.id) return item;
      const lessons = (item.lessons ?? []).filter(
        (lesson) => lesson.id !== pendingDelete.lesson.id,
      );
      return { ...item, lessons, lessonCount: lessons.length };
    });

    try {
      await saveModules(nextModules);
      setDeleteActivityOpen(false);
      setPendingDelete(null);
      setDeleteDoneOpen(true);
    } catch (error) {
      mutationToast.error(
        error instanceof Error ? error.message : "Failed to delete activity.",
      );
    }
  };

  const goToActivity = (type: ClassroomLessonType, lessonId?: string) => {
    const params = new URLSearchParams({ moduleId, type });
    if (lessonId) params.set("lessonId", lessonId);
    router.push(
      adminPath(`/courses/${courseId}/activities/new?${params.toString()}`),
    );
  };

  if (isProgramLoading || isModulesLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!program || !module || isModulesError) {
    return (
      <section className="space-y-6">
        <AlertBanner variant="error">
          {modulesError instanceof Error
            ? modulesError.message
            : "Module not found."}
        </AlertBanner>
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            router.push(adminPath(`/courses/${courseId}/curriculum`))
          }
        >
          Back to curriculum
        </Button>
      </section>
    );
  }

  const moduleList = [module];

  return (
    <section className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-[14px] text-[#94A3B8]">
        <Link href={adminPath("/courses")} className="hover:text-[#4C7D5B]">
          Courses
        </Link>
        <span className="mx-2">&gt;</span>
        <Link
          href={adminPath(`/courses/${courseId}`)}
          className="hover:text-[#4C7D5B]"
        >
          {program.title}
        </Link>
        <span className="mx-2">&gt;</span>
        <Link
          href={adminPath(`/courses/${courseId}/curriculum`)}
          className="hover:text-[#4C7D5B]"
        >
          Course builder
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-[#1D1D1D]">{module.title}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[24px] font-semibold text-[#1D1D1D]">
              {module.title}
            </h1>
            <button
              type="button"
              aria-label="Rename module"
              onClick={() => setRenameOpen(true)}
              className="rounded-lg border border-[#D7DFEA] p-2 text-[#64748B] transition hover:bg-[#F7F9FB] hover:text-[#1D1D1D]"
            >
              <Pencil className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Add and manage activities for this module.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            router.push(adminPath(`/courses/${courseId}/curriculum`))
          }
          className="h-11 rounded-full bg-[#ECF0F6] px-6 text-[14px] font-medium text-[#1D1D1D] hover:bg-[#E2E8F0]"
        >
          Back
        </Button>
      </div>

      <div className="rounded-[18px] border border-[#D7DFEA] bg-white p-6">
        <p className="mb-4 text-[14px] font-semibold text-[#1D1D1D]">
          Add activity
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {ACTIVITY_OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                type="button"
                onClick={() => goToActivity(option.type)}
                className="flex flex-col items-center gap-3 rounded-[14px] border-2 border-[#D7DFEA] bg-[#FAFBFC] px-6 py-8 transition hover:border-[#4C7D5B] hover:bg-[#E8F3EC]"
              >
                <Icon className="h-7 w-7 text-[#4C7D5B]" />
                <span className="text-[15px] font-medium text-[#1D1D1D]">
                  {option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold text-[#1D1D1D]">
            Activities in this module
          </h2>
          <AddItemLink
            label="Add activity"
            onClick={() => goToActivity("live_session")}
          />
        </div>

        <ModuleAccordion
          modules={moduleList}
          expandedModuleId={expandedModuleId}
          onToggleModule={(id) =>
            setExpandedModuleId((current) => (current === id ? null : id))
          }
          mode="edit"
          onEditModule={() => setRenameOpen(true)}
          onDeleteModule={() => {
            if (
              window.confirm(
                `Delete module "${module.title}" and all its activities?`,
              )
            ) {
              void saveModules(modules.filter((item) => item.id !== module.id))
                .then(() => {
                  mutationToast.success("Module deleted");
                  router.push(adminPath(`/courses/${courseId}/curriculum`));
                })
                .catch((error: unknown) => {
                  mutationToast.error(
                    error instanceof Error
                      ? error.message
                      : "Failed to delete module.",
                  );
                });
            }
          }}
          onEditActivity={(_moduleItem, lesson) =>
            goToActivity(lesson.lessonType, lesson.id)
          }
          onDeleteActivity={(_moduleItem, lesson) => {
            setPendingDelete({ module, lesson });
            setDeleteActivityOpen(true);
          }}
          onAddActivity={() => goToActivity("live_session")}
        />
      </div>

      <AddModuleModal
        open={renameOpen}
        onOpenChange={setRenameOpen}
        onSave={(name) => void renameModule(name)}
        initialName={module.title}
        title="Rename module"
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
    </section>
  );
}

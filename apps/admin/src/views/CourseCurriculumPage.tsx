"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import {
  programClassroomKeys,
  useAdminProgram,
  useDeleteProgramLessonMutation,
  useProgramClassroomModules,
  useUpdateProgramStatusMutation,
  useUpsertProgramClassroomMutation,
  getErrorMessage,
  mutationToast,
} from "@ssu/queries";
import type {
  ProgramClassroomLesson,
  ProgramClassroomModule,
} from "@ssu/types";
import { AlertBanner, Button, GoBack, usePageBreadcrumbs } from "@ssu/ui";
import { useQueryClient } from "@tanstack/react-query";
import {
  CourseBuilderShell,
  CourseCurriculumView,
  CourseSuccessModal,
} from "@/features/courses/components";
import { AdminCourseDetailSkeleton } from "@/components/skeletons";
import { buildUpsertClassroomPayload } from "@/features/courses/lib/classroom-mappers";
import type { CourseStatus } from "@/features/courses/types";

interface CourseCurriculumPageProps {
  courseId: string;
}

export function CourseCurriculumPage({ courseId }: CourseCurriculumPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    data: program,
    isLoading: isProgramLoading,
    isError: isProgramError,
  } = useAdminProgram(courseId);
  const {
    data: modules = [],
    isLoading: isModulesLoading,
    isError: isModulesError,
  } = useProgramClassroomModules(courseId, Boolean(program?.id));
  const updateStatus = useUpdateProgramStatusMutation();
  const upsertClassroom = useUpsertProgramClassroomMutation();
  const deleteLesson = useDeleteProgramLessonMutation();
  const [successOpen, setSuccessOpen] = useState(false);
  const [successVariant, setSuccessVariant] =
    useState<CourseStatus>("published");

  const isMutating =
    updateStatus.isPending ||
    upsertClassroom.isPending ||
    deleteLesson.isPending;

  const refetchModules = async () => {
    const ids = new Set(
      [courseId, program?.id].filter((id): id is string => Boolean(id?.trim())),
    );
    await Promise.all(
      [...ids].map((id) =>
        queryClient.refetchQueries({
          queryKey: programClassroomKeys.modules(id),
        }),
      ),
    );
  };

  const handleSuccessOpenChange = (open: boolean) => {
    setSuccessOpen(open);
    if (!open) {
      router.push(adminPath(`/courses/${courseId}`));
    }
  };

  const classroomStatus =
    program?.status === "published" ? "published" : "draft";

  /** Create a module, or rename one (keeps lessons; skips past startsAt). */
  const saveModule = async (module: ProgramClassroomModule) => {
    if (!program || upsertClassroom.isPending) return;

    const isNewModule = module.id.startsWith("temp-");

    try {
      const res = await upsertClassroom.mutateAsync({
        programId: program.id,
        payload: buildUpsertClassroomPayload(
          program,
          [module],
          classroomStatus,
          // Rename must still send lessons (published classroom rule), but
          // omit past startsAt so the API does not reject the save.
          { omitPastStartsAt: !isNewModule },
        ),
      });
      await refetchModules();
      if (res.message?.trim()) {
        mutationToast.success(res.message);
      }
    } catch (error) {
      mutationToast.error(
        getErrorMessage(error, "Something went wrong. Try again later."),
      );
      throw error;
    }
  };

  const handleDeleteActivity = async (
    module: ProgramClassroomModule,
    lesson: ProgramClassroomLesson,
  ) => {
    if (!program?.id || deleteLesson.isPending) return;

    try {
      const res = await deleteLesson.mutateAsync({
        programId: program.id,
        moduleId: module.id,
        lessonId: lesson.id,
      });
      await refetchModules();
      if (res.message?.trim()) {
        mutationToast.success(res.message);
      }
    } catch (error) {
      mutationToast.error(
        getErrorMessage(error, "Something went wrong. Try again later."),
      );
      throw error;
    }
  };

  const saveCourse = async (status: "draft" | "published") => {
    if (!program || updateStatus.isPending) return;

    try {
      await updateStatus.mutateAsync({ programId: program.id, status });
      setSuccessVariant(status);
      setSuccessOpen(true);
    } catch (error) {
      mutationToast.error(
        getErrorMessage(error, "Something went wrong. Try again later."),
      );
    }
  };

  usePageBreadcrumbs(
    program
      ? [
          { label: "Courses", href: adminPath("/courses") },
          {
            label: program.title,
            href: adminPath(`/courses/${courseId}`),
          },
          { label: "Curriculum" },
        ]
      : [
          { label: "Courses", href: adminPath("/courses") },
          { label: "Course", href: adminPath(`/courses/${courseId}`) },
          { label: "Curriculum" },
        ],
  );

  if (isProgramLoading && !program) {
    return (
      <section className="space-y-4">
        <GoBack fallbackHref={adminPath(`/courses/${courseId}`)} />
        <AdminCourseDetailSkeleton />
      </section>
    );
  }

  if (isProgramError || !program) {
    return (
      <section className="space-y-6">
        <GoBack fallbackHref={adminPath("/courses")} />
        <AlertBanner variant="error">Try again later.</AlertBanner>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <GoBack fallbackHref={adminPath(`/courses/${courseId}`)} />

      <CourseBuilderShell
        activeStep={2}
        showStepper
        onSaveDraft={() => void saveCourse("draft")}
        onPublish={() => void saveCourse("published")}
        isSaving={isMutating}
        footer={
          <div className="flex justify-end border-t border-[#EEF2F6] px-6 py-5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push(adminPath(`/courses/${courseId}`))}
              className="h-11 rounded-full bg-[#ECF0F6] px-8 text-[14px] font-medium text-[#1D1D1D] hover:bg-[#E2E8F0]"
            >
              Back
            </Button>
          </div>
        }
      >
        <CourseCurriculumView
          program={program}
          modules={modules}
          isLoadingModules={isModulesLoading}
          modulesError={isModulesError ? "Try again later." : null}
          isSaving={isMutating}
          onSaveModule={saveModule}
          onDeleteActivity={handleDeleteActivity}
        />
      </CourseBuilderShell>

      <CourseSuccessModal
        open={successOpen}
        onOpenChange={handleSuccessOpenChange}
        variant={successVariant}
      />
    </section>
  );
}

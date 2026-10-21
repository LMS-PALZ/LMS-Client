"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import {
  useAdminProgram,
  useProgramClassroomModules,
  useUpdateProgramStatusMutation,
  useUpsertProgramClassroomMutation,
  getErrorMessage,
  mutationToast,
} from "@ssu/queries";
import type { ProgramClassroomModule } from "@ssu/types";
import { AlertBanner, Button, GoBack, usePageBreadcrumbs } from "@ssu/ui";
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
  const {
    data: program,
    isLoading: isProgramLoading,
    isError: isProgramError,
    error: programError,
  } = useAdminProgram(courseId);
  const {
    data: modules = [],
    isLoading: isModulesLoading,
    isError: isModulesError,
    error: modulesError,
  } = useProgramClassroomModules(courseId, Boolean(program?.id));
  const updateStatus = useUpdateProgramStatusMutation();
  const upsertClassroom = useUpsertProgramClassroomMutation();
  const [successOpen, setSuccessOpen] = useState(false);
  const [successVariant, setSuccessVariant] =
    useState<CourseStatus>("published");

  const handleSuccessOpenChange = (open: boolean) => {
    setSuccessOpen(open);
    if (!open) {
      router.push(adminPath(`/courses/${courseId}`));
    }
  };

  const saveModules = async (nextModules: ProgramClassroomModule[]) => {
    const latestModule = nextModules.at(-1);
    if (!program || upsertClassroom.isPending) return;

    try {
      await upsertClassroom.mutateAsync({
        programId: program.id,
        payload: buildUpsertClassroomPayload(
          program,
          latestModule ? [latestModule] : [],
          program.status === "published" ? "published" : "draft",
        ),
      });
      mutationToast.success("Course activity saved");
    } catch (error) {
      mutationToast.error(
        error instanceof Error ? error.message : "Failed to save modules.",
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
      mutationToast.error(getErrorMessage(error, "Failed to update course."));
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
        <AlertBanner variant="error">
          {programError instanceof Error
            ? programError.message
            : "Failed to load course."}
        </AlertBanner>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <GoBack fallbackHref={adminPath(`/courses/${courseId}`)} />

      {(updateStatus.isError || upsertClassroom.isError) && (
        <AlertBanner variant="error">
          {updateStatus.error instanceof Error
            ? updateStatus.error.message
            : upsertClassroom.error instanceof Error
              ? upsertClassroom.error.message
              : "Failed to update course."}
        </AlertBanner>
      )}

      <CourseBuilderShell
        activeStep={2}
        showStepper
        onSaveDraft={() => void saveCourse("draft")}
        onPublish={() => void saveCourse("published")}
        isSaving={updateStatus.isPending || upsertClassroom.isPending}
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
          modulesError={
            isModulesError && modulesError instanceof Error
              ? modulesError.message
              : null
          }
          isSaving={upsertClassroom.isPending}
          onSaveModules={saveModules}
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

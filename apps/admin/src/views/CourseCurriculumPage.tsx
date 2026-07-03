"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import {
  useAdminProgram,
  useProgramClassroomModules,
  useUpdateProgramStatusMutation,
  useUpsertProgramClassroomMutation,
  mutationToast,
} from "@ssu/queries";
import type { ProgramClassroomModule } from "@ssu/types";
import { AlertBanner, Button } from "@ssu/ui";
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
    if (!program || upsertClassroom.isPending) return;

    try {
      await upsertClassroom.mutateAsync({
        programId: program.id,
        payload: buildUpsertClassroomPayload(
          program,
          nextModules,
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
    } catch {
      // Error surfaced via mutation state below.
    }
  };

  if (isProgramLoading && !program) {
    return <AdminCourseDetailSkeleton />;
  }

  if (isProgramError || !program) {
    return (
      <section className="space-y-6">
        <AlertBanner variant="error">
          {programError instanceof Error
            ? programError.message
            : "Failed to load course."}
        </AlertBanner>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push(adminPath("/courses"))}
          className="h-10 rounded-full border border-[#E2E8F0] px-5"
        >
          Back to courses
        </Button>
      </section>
    );
  }

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
        <span className="text-[#1D1D1D]">Course builder</span>
      </nav>

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

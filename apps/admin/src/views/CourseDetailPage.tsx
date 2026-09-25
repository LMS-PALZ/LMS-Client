"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import {
  getErrorMessage,
  mutationToast,
  useAdminProgram,
  useDeleteProgramMutation,
  useProgramClassroomModules,
  useTutorStaff,
  useUpdateProgramStatusMutation,
} from "@ssu/queries";
import { AlertBanner } from "@ssu/ui";
import {
  CourseCohortsTab,
  CourseDetailHeader,
  CourseDetailTabs,
  CourseStudentsTab,
  CourseModulesTab,
  DeleteCourseModal,
} from "@/features/courses/components";
import { AdminCourseDetailSkeleton } from "@/components/skeletons";
import type { CourseDetailTab } from "@/features/courses/types";
import {
  mapProgramToCourse,
  mapStaffToInstructor,
} from "@/features/courses/lib/program-mappers";

interface CourseDetailPageProps {
  courseId: string;
}

function resolveInstructorLabel(
  tutorIds: string[],
  staffById: Map<string, string>,
): string {
  if (tutorIds.length === 0) return "N/A";

  const names = tutorIds
    .map((id) => staffById.get(id))
    .filter((name): name is string => Boolean(name));

  return names.length > 0 ? names.join(", ") : "N/A";
}

export function CourseDetailPage({ courseId }: CourseDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CourseDetailTab>("students");
  const [deleteOpen, setDeleteOpen] = useState(false);
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
  const { data: tutorStaff = [] } = useTutorStaff();
  const updateStatus = useUpdateProgramStatusMutation();
  const deleteCourse = useDeleteProgramMutation();

  const course = useMemo(
    () => (program ? mapProgramToCourse(program) : null),
    [program],
  );

  const staffById = useMemo(() => {
    const map = new Map<string, string>();
    for (const staff of tutorStaff) {
      const instructor = mapStaffToInstructor(staff);
      map.set(
        instructor.id,
        `${instructor.firstName} ${instructor.lastName}`.trim(),
      );
    }
    return map;
  }, [tutorStaff]);

  const instructorLabel = program
    ? resolveInstructorLabel(program.assignedTutorIds, staffById)
    : "N/A";

  const handleTogglePublish = async () => {
    if (!program || updateStatus.isPending) return;
    const nextStatus = program.status === "published" ? "draft" : "published";
    try {
      await updateStatus.mutateAsync({
        programId: program.id,
        status: nextStatus,
      });
      mutationToast.success(
        nextStatus === "published"
          ? "Course published."
          : "Course unpublished.",
      );
    } catch (error) {
      mutationToast.error(
        getErrorMessage(error, "Failed to update course status."),
      );
    }
  };

  const handleDelete = async () => {
    if (!program || deleteCourse.isPending) return;
    try {
      const result = await deleteCourse.mutateAsync(program.id);
      setDeleteOpen(false);
      mutationToast.success(result.message || "Course deleted.");
      router.push(adminPath("/courses"));
    } catch (error) {
      setDeleteOpen(false);
      mutationToast.error(getErrorMessage(error, "Failed to delete course."));
    }
  };

  if (isProgramLoading && !program) {
    return <AdminCourseDetailSkeleton />;
  }

  if (isProgramError || !program || !course) {
    return (
      <section className="space-y-6">
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
      <nav aria-label="Breadcrumb" className="text-[14px] text-[#94A3B8]">
        <Link href={adminPath("/courses")} className="hover:text-[#4C7D5B]">
          Courses
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-[#1D1D1D]">{program.title}</span>
      </nav>

      {updateStatus.isError && (
        <AlertBanner variant="error">
          {updateStatus.error instanceof Error
            ? updateStatus.error.message
            : "Failed to update course status."}
        </AlertBanner>
      )}

      {deleteCourse.isError && (
        <AlertBanner variant="error">
          {deleteCourse.error instanceof Error
            ? deleteCourse.error.message
            : "Failed to delete course."}
        </AlertBanner>
      )}

      <CourseDetailHeader
        program={program}
        instructorLabel={instructorLabel}
        onEdit={() => router.push(adminPath(`/courses/${courseId}/curriculum`))}
        onTogglePublish={() => void handleTogglePublish()}
        onDelete={() => setDeleteOpen(true)}
        isUpdating={updateStatus.isPending || deleteCourse.isPending}
      />

      <div className="rounded-[18px] border border-[#EEF2F6] bg-white px-6 py-6">
        <CourseDetailTabs value={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === "students" && (
            <CourseStudentsTab
              programId={courseId}
              cohortName={program.cohortName}
            />
          )}
          {activeTab === "modules" && (
            <CourseModulesTab
              modules={modules}
              courseId={courseId}
              isLoading={isModulesLoading}
              error={
                isModulesError && modulesError instanceof Error
                  ? modulesError.message
                  : null
              }
            />
          )}
          {activeTab === "cohorts" && (
            <CourseCohortsTab cohorts={course.cohorts} />
          )}
        </div>
      </div>

      <DeleteCourseModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => void handleDelete()}
        isDeleting={deleteCourse.isPending}
        courseTitle={program.title}
      />
    </section>
  );
}

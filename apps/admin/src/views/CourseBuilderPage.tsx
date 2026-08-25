"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import { useCreateProgramMutation, useSession } from "@ssu/queries";
import { AlertBanner } from "@ssu/ui";
import {
  CourseBasicForm,
  CourseBuilderShell,
  CourseSuccessModal,
} from "@/features/courses/components";
import { mapDraftToCreatePayload } from "@/features/courses/lib/program-mappers";
import { isBasicStepComplete } from "@/features/courses/lib/course-utils";
import type { CourseDraft, CourseStatus } from "@/features/courses/types";
import { canCreateCourses } from "@/lib/admin-roles";
import { ToggleLeft, ToggleRight } from "lucide-react";

const emptyDraft: CourseDraft = {
  name: "",
  description: "",
  price: "",
  capacity: "",
  instructors: [],
  cohorts: [],
  isGeneral: false,
};

export function CourseBuilderPage() {
  const router = useRouter();
  const { data: user, isLoading: isSessionLoading } = useSession();
  const createProgram = useCreateProgramMutation();
  const [draft, setDraft] = useState<CourseDraft>(emptyDraft);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successVariant, setSuccessVariant] =
    useState<CourseStatus>("published");

  const allowed = canCreateCourses(user?.role);

  useEffect(() => {
    if (!isSessionLoading && user && !allowed) {
      router.replace(adminPath("/courses"));
    }
  }, [allowed, isSessionLoading, router, user]);

  const canPublish = isBasicStepComplete(draft);
  const canSaveDraft = draft.name.trim().length > 0;

  const handleSuccessOpenChange = (open: boolean) => {
    setSuccessOpen(open);
    if (!open) {
      router.push(adminPath("/courses"));
    }
  };

  const saveCourse = async (status: "draft" | "published") => {
    const canSave = status === "published" ? canPublish : canSaveDraft;
    if (!canSave || createProgram.isPending || !allowed) return;

    try {
      await createProgram.mutateAsync({
        payload: mapDraftToCreatePayload(draft, status),
        tutorIds: draft.instructors.map((instructor) => instructor.id),
      });
      setSuccessVariant(status);
      setSuccessOpen(true);
    } catch {
      // Error surfaced via mutation state below.
    }
  };

  if (isSessionLoading || (user && !allowed)) {
    return null;
  }

  return (
    <section className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-[14px] text-[#94A3B8]">
        <Link href={adminPath("/courses")} className="hover:text-[#4C7D5B]">
          Courses
        </Link>
        <span className="mx-2">&gt;</span>
        <span className="text-[#1D1D1D]">Course builder</span>
      </nav>

      {createProgram.isError && (
        <AlertBanner variant="error">
          {createProgram.error instanceof Error
            ? createProgram.error.message
            : "Failed to save course."}
        </AlertBanner>
      )}

      <CourseBuilderShell
        onSaveDraft={() => void saveCourse("draft")}
        onPublish={() => void saveCourse("published")}
        saveDraftDisabled={!canSaveDraft}
        publishDisabled={!canPublish}
        isSaving={createProgram.isPending}
      >
        <CourseBasicForm value={draft} onChange={setDraft} />

        <div className="flex mx-auto w-full max-w-[640px] items-center justify-between rounded-xl border border-[#E2E8F0] p-4">
          <div>
            <p className="text-[15px] font-medium text-[#1D1D1D]">
              General Course
            </p>

            <p className="text-sm text-[#64748B]">
              Make this course available to all students.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                isGeneral: !prev.isGeneral,
              }))
            }
            className="transition"
          >
            {draft.isGeneral ? (
              <ToggleRight size={40} className="text-[#16A34A]" />
            ) : (
              <ToggleLeft size={40} className="text-[#CBD5E1]" />
            )}
          </button>
        </div>
      </CourseBuilderShell>

      <CourseSuccessModal
        open={successOpen}
        onOpenChange={handleSuccessOpenChange}
        variant={successVariant}
      />
    </section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminPath } from "@ssu/config/portal-paths";
import { useCreateProgramMutation } from "@ssu/queries";
import { AlertBanner } from "@ssu/ui";
import {
  CourseBasicForm,
  CourseBuilderShell,
  CourseSuccessModal,
} from "@/features/courses/components";
import { mapDraftToCreatePayload } from "@/features/courses/lib/program-mappers";
import { isBasicStepComplete } from "@/features/courses/lib/course-utils";
import type { CourseDraft, CourseStatus } from "@/features/courses/types";

const emptyDraft: CourseDraft = {
  name: "",
  description: "",
  price: "",
  capacity: "",
  instructors: [],
  cohorts: [],
};

export function CourseBuilderPage() {
  const router = useRouter();
  const createProgram = useCreateProgramMutation();
  const [draft, setDraft] = useState<CourseDraft>(emptyDraft);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successVariant, setSuccessVariant] =
    useState<CourseStatus>("published");

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
    if (!canSave || createProgram.isPending) return;

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
      </CourseBuilderShell>

      <CourseSuccessModal
        open={successOpen}
        onOpenChange={handleSuccessOpenChange}
        variant={successVariant}
      />
    </section>
  );
}

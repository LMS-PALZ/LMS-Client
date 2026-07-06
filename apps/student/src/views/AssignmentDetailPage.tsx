"use client";

import {
  AssessmentDetailHeader,
  AssessmentInstructions,
  AssessmentMyWork,
  AssessmentReferenceMaterial,
  AssessmentSuccessBanner,
} from "@/components/assessments";
import { getAssessmentDetailContent } from "@/lib/assessments";
import {
  formatAssignmentDueDateLong,
  isAssignmentWorkLocked,
  resolveAssignmentDetailStatus,
} from "@/lib/assignment-display";
import { useStudentAssessmentById } from "@ssu/queries";
import { useAssessmentSubmissionStore } from "@ssu/store";
import { AlertBanner, DetailPageSkeleton, GoBack } from "@ssu/ui";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export function AssignmentDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";

  const studentAssessment = useStudentAssessmentById(id);

  const isSubmitted = useAssessmentSubmissionStore(
    (s) => s.byAssignment[id]?.isSubmitted ?? false,
  );
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    if (isSubmitted) {
      setShowSuccessBanner(true);
    }
  }, [isSubmitted]);

  if (studentAssessment.isLoading) {
    return (
      <div className="space-y-4">
        <GoBack fallbackHref="/assessments" />
        <DetailPageSkeleton sections={1} />
      </div>
    );
  }

  if (studentAssessment.isError || !studentAssessment.data) {
    return (
      <div className="space-y-4">
        <GoBack fallbackHref="/assessments" />
        <AlertBanner variant="error">Assignment not found.</AlertBanner>
      </div>
    );
  }

  const assignment = studentAssessment.data;
  const content = getAssessmentDetailContent(assignment.instructions);
  const status = resolveAssignmentDetailStatus(assignment, isSubmitted);
  const workLocked = isAssignmentWorkLocked(assignment, isSubmitted);
  const showSubmitSuccess =
    showSuccessBanner && isSubmitted && assignment.status !== "graded";

  return (
    <div className="space-y-6">
      {showSubmitSuccess ? (
        <AssessmentSuccessBanner
          message="You have successfully submitted your assignment"
          onDismiss={() => setShowSuccessBanner(false)}
        />
      ) : null}

      <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-8">
        <AssessmentDetailHeader
          title={assignment.title}
          statusLabel={status.label}
          statusVariant={status.variant}
          dueDate={formatAssignmentDueDateLong(assignment.dueDate)}
          weightPercent={assignment.weightPercent ?? 25}
          scoreDisplay={assignment.scoreDisplay ?? "N/A"}
        />

        <div className="space-y-6">
          <AssessmentInstructions content={content} />
          <AssessmentReferenceMaterial
            title={content.referenceTitle}
            url={content.referenceUrl}
          />
        </div>
      </div>

      <AssessmentMyWork
        assignmentId={assignment._id}
        submissionRequirements={content.submissionRequirements}
        readOnly={workLocked}
      />
    </div>
  );
}

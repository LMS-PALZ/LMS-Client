"use client";

import { useAssessmentById, useSession } from "@ssu/queries";
import {
  StaffAssessmentDetails,
  useAdminModal,
  GradeSubmissionForm,
  GoBack,
} from "@ssu/ui";
import { canGradeAssessments } from "@/lib/admin-roles";
import { adminPath } from "@ssu/config/portal-paths";

interface Props {
  assessmentId: string;
}

export function AssessmentClient({ assessmentId }: Props) {
  const { data } = useAssessmentById(assessmentId);
  const { data: user } = useSession();
  const { openModal, closeModal } = useAdminModal();
  const canGrade = canGradeAssessments(user?.role);

  const handleViewSubmission = (submission: any) => {
    openModal(
      canGrade
        ? String(submission.status ?? "").toLowerCase() === "graded"
          ? "Regrade Submission"
          : "Grade Submission"
        : "View Submission",
      <GradeSubmissionForm
        assessmentId={assessmentId}
        submissionId={submission._id}
        studentId={submission.studentId._id}
        studentName={`${submission.studentId.first_name} ${submission.studentId.last_name}`}
        submittedAt={submission.submittedAt}
        status={submission.status}
        score={submission.score}
        feedback={submission.feedback}
        comment={submission.comment}
        weight={data?.assessment?.weight ?? 0}
        file={submission.file}
        submissionLink={submission.submissionLink}
        onClose={closeModal}
        canGrade={canGrade}
      />,
    );
  };

  return (
    <div className="space-y-4">
      <GoBack fallbackHref={adminPath("/assessment")} />
      <StaffAssessmentDetails
        data={data}
        onViewSubmission={handleViewSubmission}
        canGrade={canGrade}
        canManageAssessment={canGrade}
      />
    </div>
  );
}

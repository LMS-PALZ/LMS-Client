"use client";

import { useAssessmentById } from "@ssu/queries";
import {
  StaffAssessmentDetails,
  useAdminModal,
  GradeSubmissionForm,
} from "@ssu/ui";

interface Props {
  assessmentId: string;
}

export function AssessmentClient({ assessmentId }: Props) {
  const { data } = useAssessmentById(assessmentId);
  const { openModal, closeModal } = useAdminModal();

  const handleViewSubmission = (submission: any) => {
    openModal(
      "View Submission",
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
      />,
    );
  };

  console.log("Assessment data:", data);

  return (
    <StaffAssessmentDetails
      data={data}
      onViewSubmission={handleViewSubmission}
    />
  );
}

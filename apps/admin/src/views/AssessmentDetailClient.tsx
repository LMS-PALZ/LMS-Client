"use client";

import { useAssessmentById } from "@ssu/queries";
import { StaffAssessmentDetails } from "@ssu/ui";

interface Props {
  assessmentId: string;
}

export function AssessmentClient({ assessmentId }: Props) {
  const { data } = useAssessmentById(assessmentId);

  console.log("Assessment data:", data);

  return <StaffAssessmentDetails data={data} />;
}

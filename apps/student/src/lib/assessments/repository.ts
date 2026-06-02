import assessmentsJson from "@/data/assessments.json";
import type { AssessmentDetailContent } from "./types";

type AssessmentsFile = {
  defaultReferencePdf: string;
  details: Record<
    string,
    Omit<AssessmentDetailContent, "referenceUrl"> & { referenceTitle: string }
  >;
  sharedDetail: Omit<AssessmentDetailContent, "referenceUrl"> & {
    referenceTitle: string;
  };
};

const data = assessmentsJson as AssessmentsFile;

export function getAssessmentDetailContent(
  assignmentId: string,
): AssessmentDetailContent {
  const source = data.details[assignmentId] ?? data.sharedDetail;
  return {
    ...source,
    referenceUrl: data.defaultReferencePdf,
  };
}

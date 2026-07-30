import assessmentsJson from "@/data/assessments.json";
import type { AssessmentDetailContent } from "./types";

type AssessmentDetailJson = {
  instructionsIntro?: string;
  instructions?: string;
  tasks: string[];
  submissionRequirements: string[];
  referenceTitle: string;
};

type AssessmentsFile = {
  defaultReferencePdf: string;
  details: Record<string, AssessmentDetailJson>;
  sharedDetail: AssessmentDetailJson;
};

const data = assessmentsJson as unknown as AssessmentsFile;

function toDetailContent(
  source: AssessmentDetailJson,
  referenceUrl: string,
): AssessmentDetailContent {
  return {
    instructions: source.instructions ?? source.instructionsIntro ?? "",
    tasks: source.tasks,
    submissionRequirements: source.submissionRequirements,
    referenceTitle: source.referenceTitle,
    referenceUrl,
  };
}

export function getAssessmentDetailContent(
  assignmentId: string,
): AssessmentDetailContent {
  const source = data.details[assignmentId] ?? data.sharedDetail;
  return toDetailContent(source, data.defaultReferencePdf);
}

"use client";

import type { AssessmentDetailContent } from "@/lib/assessments";

export function AssessmentInstructions({
  content,
}: {
  content: Pick<
    AssessmentDetailContent,
    "instructionsIntro" | "tasks" | "submissionRequirements"
  >;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-[15px] font-bold text-neutral-900 sm:text-[16px]">
        Instructions
      </h2>
      <p className="text-[14px] leading-7 text-neutral-600">
        {content.instructionsIntro}
      </p>
      <ul className="list-disc space-y-2 pl-5 text-[14px] leading-7 text-neutral-600">
        {content.tasks.map((task) => (
          <li key={task}>{task}</li>
        ))}
      </ul>
      <div className="space-y-2">
        <h3 className="text-[14px] font-bold text-neutral-900">
          Submission Requirements
        </h3>
        <ul className="list-disc space-y-1 pl-5 text-[14px] leading-7 text-neutral-600">
          {content.submissionRequirements.map((req) => (
            <li key={req}>{req}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

"use client";

import type { AssessmentDetailContent } from "@/lib/assessments";

export function AssessmentInstructions({
  content,
}: {
  content: Pick<AssessmentDetailContent, "instructions">;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-[15px] font-bold text-neutral-900 sm:text-[16px]">
        Instructions
      </h2>
      <p className="text-[14px] leading-7 text-neutral-600">
        {content.instructions}
      </p>
    </section>
  );
}

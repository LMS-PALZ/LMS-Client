"use client";

import { cn } from "@ssu/utils";

interface CourseBuilderStepperProps {
  activeStep: 1 | 2;
}

const steps = [
  { number: 1, label: "Basic" },
  { number: 2, label: "Curriculum" },
] as const;

export function CourseBuilderStepper({
  activeStep,
}: CourseBuilderStepperProps) {
  return (
    <ol
      className="flex items-center justify-center gap-3"
      aria-label="Course builder progress"
    >
      {steps.map((step, index) => {
        const isActive = step.number === activeStep;

        return (
          <li key={step.number} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold",
                  isActive
                    ? "bg-[#4C7D5B] text-white"
                    : "bg-[#E2E8F0] text-[#94A3B8]",
                )}
              >
                {step.number}
              </span>
              <span
                className={cn(
                  "text-[14px]",
                  isActive
                    ? "font-semibold text-[#1D1D1D]"
                    : "font-medium text-[#94A3B8]",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className="h-px w-16 bg-[#E2E8F0]" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

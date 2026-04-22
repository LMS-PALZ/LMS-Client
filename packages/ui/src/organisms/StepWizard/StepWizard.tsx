import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface StepWizardStep {
  id: string;
  label: string;
}

export interface StepWizardProps {
  steps: StepWizardStep[];
  activeIndex: number;
  children: ReactNode;
  className?: string;
}

export function StepWizard({
  steps,
  activeIndex,
  children,
  className,
}: StepWizardProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <ol className="flex flex-wrap gap-2" aria-label="Progress">
        {steps.map((s, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <li
              key={s.id}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-small font-medium",
                done && "border-brand-green bg-brand-green-50 text-brand-green",
                current &&
                  "border-brand-amber bg-brand-amber-50 text-amber-900",
                !done &&
                  !current &&
                  "border-neutral-200 bg-white text-neutral-500",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-micro",
                  done && "bg-brand-green text-white",
                  current && "bg-brand-amber text-white",
                  !done && !current && "bg-neutral-200 text-neutral-600",
                )}
              >
                {i + 1}
              </span>
              {s.label}
            </li>
          );
        })}
      </ol>
      <div>{children}</div>
    </div>
  );
}

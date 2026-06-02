"use client";

import { cn } from "@ssu/utils";
import { Info } from "lucide-react";

export function AssessmentProgressInsight({
  scorePercent,
  className,
}: {
  scorePercent: number;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, scorePercent));

  return (
    <section
      className={cn(
        "rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_1px_3px_rgba(15,23,42,0.06)] sm:p-6",
        className,
      )}
    >
      <h2 className="text-[17px] font-bold text-neutral-900 sm:text-[18px]">
        Overall insight
      </h2>

      <div className="relative mt-6">
        <div className="relative h-3 overflow-hidden rounded-full bg-[#E8ECF0]">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[#4E845F] transition-all duration-500"
            style={{ width: `${clamped}%` }}
          />
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-neutral-400"
            style={{ left: "70%" }}
            aria-hidden
          />
        </div>
        <div className="mt-2 flex justify-between text-[11px] font-medium text-neutral-500 sm:text-[12px]">
          <span>0</span>
          <span>70% Target</span>
          <span>100% Excellent</span>
        </div>
        {clamped > 0 && clamped < 15 ? (
          <div
            className="pointer-events-none absolute -top-10 rounded-md bg-neutral-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-md"
            style={{ left: `${Math.max(clamped - 4, 2)}%` }}
          >
            {clamped}% You&apos;re off to a great start
            <span
              className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-neutral-900"
              aria-hidden
            />
          </div>
        ) : null}
      </div>

      <p className="mt-5 text-[13px] text-neutral-600 sm:text-[14px]">
        You have achieved a score of{" "}
        <span className="font-semibold text-neutral-900">{clamped}%</span>
      </p>

      <p className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-neutral-500 sm:text-[13px]">
        <Info
          className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400"
          aria-hidden
        />
        Reach a cumulative score of 70% across all assignments to unlock your
        graduation certificate.
      </p>
    </section>
  );
}

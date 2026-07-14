"use client";

import { GoBack, type AssignmentSummaryStatusVariant } from "@ssu/ui";
import { cn } from "@ssu/utils";
import Link from "next/link";

const statusPillStyles: Record<AssignmentSummaryStatusVariant, string> = {
  todo: "bg-[#E0F2FE] text-[#2563EB]",
  graded: "bg-[#D4EDDA] text-[#2D6A4F]",
  pendingReview: "bg-[#E0F2FE] text-[#2563EB]",
  notSubmitted: "bg-[#FEE8E8] text-[#DC2626]",
  draft: "bg-[#FFDFC5] text-[#F49221]",
  published: "bg-[#DBF1DC] text-[#1F6E2A]",
  closed: "bg-[#E2E8F0] text-[#475569]",
  archive: "bg-[#E2E8F0] text-[#475569]",
};

function MetricColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] font-semibold text-neutral-800 sm:text-[13px]">
        {label}
      </dt>
      <dd className="mt-1 text-[12px] text-neutral-500 sm:text-[13px]">
        {value}
      </dd>
    </div>
  );
}

export function AssessmentDetailHeader({
  title,
  statusLabel,
  statusVariant = "todo",
  dueDate,
  weightPercent,
  scoreDisplay,
  className,
}: {
  title: string;
  statusLabel: string;
  statusVariant?: AssignmentSummaryStatusVariant;
  dueDate: string;
  weightPercent: number;
  scoreDisplay: string;
  className?: string;
}) {
  return (
    <header className={cn("space-y-4", className)}>
      <GoBack fallbackHref="/assessments" />

      <nav
        aria-label="Breadcrumb"
        className="text-[13px] text-neutral-500 sm:text-[14px]"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link
              href="/assessments"
              className="font-medium text-neutral-500 transition hover:text-brand-green"
            >
              Assessment
            </Link>
          </li>
          <li aria-hidden className="text-neutral-400">
            &gt;
          </li>
          <li className="line-clamp-1 font-medium text-neutral-700">{title}</li>
        </ol>
      </nav>

      <span
        className={cn(
          "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold",
          statusPillStyles[statusVariant],
        )}
      >
        {statusLabel}
      </span>

      <h1 className="text-[22px] font-bold leading-snug text-neutral-900 sm:text-[26px]">
        {title}
      </h1>

      <dl className="grid max-w-xl grid-cols-3 gap-4 border-b border-neutral-200/80 pb-6">
        <MetricColumn label="Due date" value={dueDate} />
        <MetricColumn label="Weight" value={`${weightPercent}%`} />
        <MetricColumn label="Score" value={scoreDisplay} />
      </dl>
    </header>
  );
}

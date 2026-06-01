import { TagHorizontalIcon } from "../../icons";
import { cn } from "@ssu/utils";
import type { StatusBadgeProps } from "../StatusBadge";

export interface AssignmentSummaryCardProps {
  title: string;
  moduleLabel: string;
  dueDate: string;
  weightPercent?: number;
  scoreDisplay?: string;
  statusLabel?: string;
  statusVariant?: NonNullable<StatusBadgeProps["variant"]>;
  className?: string;
  onClick?: () => void;
}

export const ASSIGNMENT_SUMMARY_CARD_BG = "#F1F6FA";

function AssignmentStatusPill({
  label,
  variant,
}: {
  label: string;
  variant: NonNullable<StatusBadgeProps["variant"]>;
}) {
  const isNotSubmitted = variant === "notSubmitted";
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold leading-none",
        isNotSubmitted
          ? "bg-[#FEE8E8] text-[#DC2626]"
          : "bg-[#E8ECF0] text-neutral-700",
      )}
    >
      {label}
    </span>
  );
}

function MetricColumn({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12px] font-semibold text-neutral-800">{label}</dt>
      <dd className="mt-1 text-[12px] text-neutral-500">{value}</dd>
    </div>
  );
}

export function AssignmentSummaryCard({
  title,
  moduleLabel,
  dueDate,
  weightPercent = 0,
  scoreDisplay = "N/A",
  statusLabel = "To do",
  statusVariant = "todo",
  className,
  onClick,
}: AssignmentSummaryCardProps) {
  const Wrapper = onClick ? "button" : "article";
  const weightValue = `${weightPercent}%`;

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "relative flex min-h-[188px] flex-col rounded-2xl p-4 text-left sm:min-h-[196px]",
        onClick && "cursor-pointer transition-opacity hover:opacity-95",
        className,
      )}
      style={{ backgroundColor: ASSIGNMENT_SUMMARY_CARD_BG }}
    >
      <h3 className="mb-2.5 line-clamp-2 text-[14px] font-bold leading-snug text-neutral-900 sm:text-[15px]">
        {title}
      </h3>

      <div className="mb-4 flex items-center gap-2 text-[12px] text-neutral-500">
        <TagHorizontalIcon size={14} aria-hidden />
        <span className="line-clamp-1">{moduleLabel}</span>
      </div>

      <dl className="mb-4 grid grid-cols-3 gap-2">
        <MetricColumn label="Due date" value={dueDate} />
        <MetricColumn label="Weight" value={weightValue} />
        <MetricColumn label="Score" value={scoreDisplay} />
      </dl>

      <div className="mt-auto flex justify-end">
        <AssignmentStatusPill label={statusLabel} variant={statusVariant} />
      </div>
    </Wrapper>
  );
}

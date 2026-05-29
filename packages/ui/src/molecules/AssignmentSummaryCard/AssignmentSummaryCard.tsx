import { cn } from "@ssu/utils";
import { Calendar, ClipboardList, FileText } from "lucide-react";
import { StatusBadge } from "../StatusBadge";

export interface AssignmentSummaryCardProps {
  title: string;
  moduleLabel: string;
  score?: number | string;
  dueDate: string;
  showDueBadge?: boolean;
  className?: string;
  onClick?: () => void;
}

export function AssignmentSummaryCard({
  title,
  moduleLabel,
  score,
  dueDate,
  showDueBadge,
  className,
  onClick,
}: AssignmentSummaryCardProps) {
  const Wrapper = onClick ? "button" : "article";

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-2xl border bg-white p-4 shadow-card text-left w-full",
        onClick && "hover:shadow-card-hover transition-shadow cursor-pointer",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-h4 font-semibold text-neutral-900 line-clamp-2">
          {title}
        </h3>
        {showDueBadge && <StatusBadge variant="due">Due</StatusBadge>}
      </div>
      <ul className="space-y-2 text-small text-neutral-600">
        <li className="flex items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-neutral-400" />
          {moduleLabel}
        </li>
        {score !== undefined && (
          <li className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4 shrink-0 text-neutral-400" />
            {score}
          </li>
        )}
        <li className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-neutral-400" />
          {dueDate}
        </li>
      </ul>
    </Wrapper>
  );
}

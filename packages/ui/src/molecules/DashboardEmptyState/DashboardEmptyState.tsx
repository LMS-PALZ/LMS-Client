import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";
import { PageBackFrame } from "../PageBackFrame";

export interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
  /** When set, shows a top Go back control for inner pages. */
  backHref?: string;
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  className,
  backHref,
}: DashboardEmptyStateProps) {
  const body = (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-2xl bg-brand-green-100 p-4">
        <Icon className="h-8 w-8 text-brand-green" aria-hidden />
      </div>
      <p className="text-body font-medium text-neutral-700">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-small text-neutral-500">
          {description}
        </p>
      )}
    </div>
  );

  if (!backHref) return body;

  return <PageBackFrame fallbackHref={backHref}>{body}</PageBackFrame>;
}

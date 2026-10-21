import type { ReactNode } from "react";
import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";
import { PageBackFrame } from "../PageBackFrame";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** When set, shows a top Go back control for inner pages. */
  backHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  backHref,
}: EmptyStateProps) {
  const body = (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-4 py-10 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-2xl bg-neutral-100 p-4">
        <Icon className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="mb-1 text-h4 font-semibold text-neutral-700">{title}</h3>
      {description && (
        <p className="mb-6 max-w-xs text-small text-neutral-500">
          {description}
        </p>
      )}
      {action}
    </div>
  );

  if (!backHref) return body;

  return <PageBackFrame fallbackHref={backHref}>{body}</PageBackFrame>;
}

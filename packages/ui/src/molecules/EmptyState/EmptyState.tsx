import type { ReactNode } from "react";
import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className,
      )}
    >
      <div className="p-4 rounded-2xl bg-neutral-100 mb-4">
        <Icon className="h-8 w-8 text-neutral-400" />
      </div>
      <h3 className="text-h4 font-semibold text-neutral-700 mb-1">{title}</h3>
      {description && (
        <p className="text-small text-neutral-500 max-w-xs mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
}

import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";

export interface DashboardEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  className?: string;
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
  className,
}: DashboardEmptyStateProps) {
  return (
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
        <p className="mt-1 text-small text-neutral-500 max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}

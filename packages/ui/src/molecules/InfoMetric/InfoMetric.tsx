import { cn } from "@ssu/utils";
import type { LucideIcon } from "lucide-react";

export interface InfoMetricProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

export function InfoMetric({ icon: Icon, label, className }: InfoMetricProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-small text-neutral-600",
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
      <span>{label}</span>
    </div>
  );
}

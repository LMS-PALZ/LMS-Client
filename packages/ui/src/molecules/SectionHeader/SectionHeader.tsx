import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeader({
  title,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-h3 font-bold text-neutral-900">{title}</h2>
      {action}
    </div>
  );
}

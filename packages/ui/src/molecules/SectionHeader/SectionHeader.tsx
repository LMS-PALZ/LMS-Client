import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
  className?: string;
  variant?: "default" | "inline";
}

export function SectionHeader({
  title,
  action,
  className,
  variant = "default",
}: SectionHeaderProps) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <h2 className="text-[17px] font-bold text-neutral-900 sm:text-[18px]">
          {title}
        </h2>
        {action ? (
          <>
            <span className="h-4 w-px shrink-0 bg-neutral-300" aria-hidden />
            {action}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className="text-h3 font-bold text-neutral-900">{title}</h2>
      {action}
    </div>
  );
}

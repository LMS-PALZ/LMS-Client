import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface TopHeaderProps {
  titleSlot?: ReactNode;
  endSlot?: ReactNode;
  className?: string;
}

export function TopHeader({ titleSlot, endSlot, className }: TopHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-1 items-center justify-between gap-4 min-w-0",
        className,
      )}
    >
      <div className="min-w-0">{titleSlot}</div>
      <div className="flex items-center gap-2 shrink-0">{endSlot}</div>
    </div>
  );
}

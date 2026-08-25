import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
  /** Width of the last line (CSS width value or Tailwind class). */
  lastLineClassName?: string;
}

export function SkeletonText({
  lines = 1,
  className,
  lineClassName = "h-4 w-full",
  lastLineClassName = "w-3/4",
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn(
            lineClassName,
            index === lines - 1 && lines > 1 && lastLineClassName,
          )}
        />
      ))}
    </div>
  );
}

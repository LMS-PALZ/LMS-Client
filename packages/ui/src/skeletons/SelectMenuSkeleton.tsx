import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";

export interface SelectMenuSkeletonProps {
  rows?: number;
  className?: string;
}

export function SelectMenuSkeleton({
  rows = 4,
  className,
}: SelectMenuSkeletonProps) {
  return (
    <div className={cn("space-y-2 px-2 py-2", className)} aria-hidden>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-3 px-2 py-2"
        >
          <Skeleton className="h-4 w-2/3 rounded-md" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { skeletonSectionSurface } from "./utils";

export interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function DataTableSkeleton({
  rows = 6,
  columns = 5,
  className,
}: DataTableSkeletonProps) {
  return (
    <div
      className={cn(skeletonSectionSurface, "space-y-4", className)}
      aria-hidden
    >
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>
      <div className="space-y-2 border-t border-neutral-100 pt-4">
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={`head-${index}`} className="h-4 w-20 rounded-md" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4 py-2"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={`${rowIndex}-${colIndex}`}
                className="h-4 w-full max-w-[140px] rounded-md"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

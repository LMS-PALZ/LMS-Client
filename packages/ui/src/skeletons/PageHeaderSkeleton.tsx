import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { SkeletonText } from "./SkeletonText";

export interface PageHeaderSkeletonProps {
  showBreadcrumbs?: boolean;
  className?: string;
}

export function PageHeaderSkeleton({
  showBreadcrumbs = false,
  className,
}: PageHeaderSkeletonProps) {
  return (
    <div
      className={cn("space-y-3", className)}
      role="status"
      aria-label="Loading page header"
    >
      {showBreadcrumbs && (
        <div className="flex gap-2" aria-hidden>
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-3 w-3 rounded-md" />
          <Skeleton className="h-3 w-20 rounded-md" />
        </div>
      )}
      <Skeleton className="h-9 w-48 max-w-full rounded-lg" aria-hidden />
      <SkeletonText lines={1} lineClassName="h-4 w-72 max-w-full rounded-md" />
    </div>
  );
}

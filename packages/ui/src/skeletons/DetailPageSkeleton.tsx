import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { PageHeaderSkeleton } from "./PageHeaderSkeleton";
import { SkeletonText } from "./SkeletonText";
import { skeletonSectionSurface } from "./utils";

export interface DetailPageSkeletonProps {
  className?: string;
  sections?: number;
}

export function DetailPageSkeleton({
  className,
  sections = 2,
}: DetailPageSkeletonProps) {
  return (
    <div
      className={cn("space-y-6", className)}
      role="status"
      aria-label="Loading page"
    >
      <PageHeaderSkeleton showBreadcrumbs />
      {Array.from({ length: sections }).map((_, index) => (
        <div
          key={index}
          className={cn(skeletonSectionSurface, "space-y-4")}
          aria-hidden
        >
          <Skeleton className="h-6 w-40 rounded-md" />
          <SkeletonText lines={4} lineClassName="h-4 w-full rounded-md" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      ))}
    </div>
  );
}

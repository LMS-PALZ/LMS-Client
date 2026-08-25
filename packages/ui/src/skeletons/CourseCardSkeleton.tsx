import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { SkeletonImage } from "./SkeletonImage";
import { SkeletonText } from "./SkeletonText";
import { skeletonCardSurface } from "./utils";

export interface CourseCardSkeletonProps {
  className?: string;
}

export function CourseCardSkeleton({ className }: CourseCardSkeletonProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-card",
        className,
      )}
      aria-hidden
    >
      <SkeletonImage aspectRatio="banner" className="rounded-none" />
      <div
        className={cn(skeletonCardSurface, "border-0 shadow-none space-y-3")}
      >
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <SkeletonText lines={2} lineClassName="h-3 w-full rounded-md" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-[var(--radius-button)]" />
      </div>
    </div>
  );
}

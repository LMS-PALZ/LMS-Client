import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { SkeletonText } from "./SkeletonText";
import { skeletonCardSurface } from "./utils";

export interface StatCardSkeletonProps {
  className?: string;
}

export function StatCardSkeleton({ className }: StatCardSkeletonProps) {
  return (
    <div
      className={cn(skeletonCardSurface, "min-h-[112px] space-y-4", className)}
      aria-hidden
    >
      <div className="flex items-start justify-between gap-3">
        <SkeletonText lines={2} lineClassName="h-3 w-24 rounded-md" />
        <Skeleton className="h-10 w-10 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-16 rounded-lg" />
    </div>
  );
}

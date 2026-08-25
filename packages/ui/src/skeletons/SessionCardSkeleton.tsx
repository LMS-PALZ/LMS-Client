import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { skeletonCardSurface } from "./utils";

export interface SessionCardSkeletonProps {
  className?: string;
}

export function SessionCardSkeleton({ className }: SessionCardSkeletonProps) {
  return (
    <div
      className={cn(
        skeletonCardSurface,
        "min-h-[235px] space-y-3 sm:min-h-[245px]",
        className,
      )}
      aria-hidden
    >
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-5 w-3/4 max-w-[240px] rounded-md" />
      <Skeleton className="h-3 w-40 rounded-md" />
      <Skeleton className="h-4 w-28 rounded-md" />
    </div>
  );
}

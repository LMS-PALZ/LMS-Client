import { cn } from "@ssu/utils";
import { SkeletonText } from "./SkeletonText";
import { skeletonCardSurface } from "./utils";

export interface CardSkeletonProps {
  className?: string;
  lines?: number;
}

export function CardSkeleton({ className, lines = 3 }: CardSkeletonProps) {
  return (
    <div
      className={cn(skeletonCardSurface, "space-y-3", className)}
      aria-hidden
    >
      <SkeletonText lines={lines} lineClassName="h-4 w-full rounded-md" />
    </div>
  );
}

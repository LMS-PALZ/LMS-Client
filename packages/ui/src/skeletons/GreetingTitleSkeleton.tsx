import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";

export interface GreetingTitleSkeletonProps {
  className?: string;
}

export function GreetingTitleSkeleton({
  className,
}: GreetingTitleSkeletonProps) {
  return (
    <Skeleton
      className={cn("h-10 w-72 max-w-full rounded-lg", className)}
      aria-hidden
    />
  );
}

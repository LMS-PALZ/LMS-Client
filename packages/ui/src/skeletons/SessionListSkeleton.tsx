import { cn } from "@ssu/utils";
import { SessionCardSkeleton } from "./SessionCardSkeleton";

export interface SessionListSkeletonProps {
  count?: number;
  className?: string;
}

export function SessionListSkeleton({
  count = 3,
  className,
}: SessionListSkeletonProps) {
  return (
    <div
      className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-3", className)}
      role="status"
      aria-label="Loading sessions"
    >
      {Array.from({ length: count }).map((_, index) => (
        <SessionCardSkeleton key={index} />
      ))}
    </div>
  );
}

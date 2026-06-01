import { cn } from "@ssu/utils";
import type { ReactNode } from "react";
import { AssignmentCardSkeleton } from "./AssignmentCardSkeleton";

export interface GridSkeletonProps {
  count?: number;
  className?: string;
  columnsClassName?: string;
  children?: ReactNode;
}

export function GridSkeleton({
  count = 4,
  className,
  columnsClassName = "sm:grid-cols-2 lg:grid-cols-3",
  children,
}: GridSkeletonProps) {
  return (
    <div
      className={cn("grid gap-4", columnsClassName, className)}
      role="status"
      aria-label="Loading content"
    >
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{children}</div>
      ))}
    </div>
  );
}

export function AssignmentGridSkeleton({
  count = 4,
  className,
  columnsClassName = "sm:grid-cols-2 lg:grid-cols-4",
}: Omit<GridSkeletonProps, "children">) {
  return (
    <GridSkeleton
      count={count}
      className={className}
      columnsClassName={columnsClassName}
    >
      <AssignmentCardSkeleton />
    </GridSkeleton>
  );
}

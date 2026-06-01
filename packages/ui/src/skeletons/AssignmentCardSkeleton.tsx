import { ASSIGNMENT_SUMMARY_CARD_BG } from "../molecules/AssignmentSummaryCard/AssignmentSummaryCard";
import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";

export interface AssignmentCardSkeletonProps {
  className?: string;
}

export function AssignmentCardSkeleton({
  className,
}: AssignmentCardSkeletonProps) {
  return (
    <div
      className={cn(
        "min-h-[188px] rounded-2xl p-4 sm:min-h-[196px]",
        className,
      )}
      style={{ backgroundColor: ASSIGNMENT_SUMMARY_CARD_BG }}
      aria-hidden
    >
      <Skeleton className="mb-3 h-5 w-full max-w-[200px] rounded-md bg-white/50" />
      <Skeleton className="mb-4 h-3 w-36 rounded-md bg-white/50" />
      <div className="mb-4 grid grid-cols-3 gap-2">
        <Skeleton className="h-10 rounded-md bg-white/50" />
        <Skeleton className="h-10 rounded-md bg-white/50" />
        <Skeleton className="h-10 rounded-md bg-white/50" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-6 w-20 rounded-full bg-white/50" />
      </div>
    </div>
  );
}

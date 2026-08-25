import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { SkeletonText } from "./SkeletonText";

export interface WelcomeCardSkeletonProps {
  className?: string;
}

export function WelcomeCardSkeleton({ className }: WelcomeCardSkeletonProps) {
  return (
    <div
      className={cn(
        "flex min-h-[240px] flex-col rounded-2xl bg-[#FFE0C5] p-5 sm:min-h-[260px] sm:p-6",
        className,
      )}
      aria-hidden
    >
      <div className="space-y-2">
        <Skeleton className="h-7 w-44 rounded-lg bg-white/40" />
        <SkeletonText
          lines={2}
          lineClassName="h-4 w-full max-w-[260px] rounded-md bg-white/40"
        />
      </div>
      <div className="mt-auto inline-flex items-end pt-6 sm:pt-8">
        <Skeleton className="h-[142px] w-[240px] rounded-t-full bg-white/40" />
        <Skeleton className="-ml-3 mb-3 h-3 w-40 shrink-0 rounded-md bg-white/40 sm:-ml-4" />
      </div>
    </div>
  );
}

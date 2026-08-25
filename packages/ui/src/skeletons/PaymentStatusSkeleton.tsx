import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { SkeletonCircle } from "./SkeletonCircle";
import { SkeletonText } from "./SkeletonText";

export interface PaymentStatusSkeletonProps {
  className?: string;
}

export function PaymentStatusSkeleton({
  className,
}: PaymentStatusSkeletonProps) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center",
        className,
      )}
      role="status"
      aria-label="Verifying payment"
    >
      <SkeletonCircle size="xl" className="h-16 w-16" />
      <SkeletonText
        lines={2}
        className="w-full max-w-xs"
        lineClassName="mx-auto h-5 w-56 rounded-md"
      />
      <Skeleton className="h-4 w-40 rounded-md" aria-hidden />
    </div>
  );
}

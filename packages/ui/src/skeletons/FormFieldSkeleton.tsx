import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";

export interface FormFieldSkeletonProps {
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export function FormFieldSkeleton({
  className,
  labelClassName = "h-4 w-24",
  inputClassName = "h-11 w-full rounded-[12px]",
}: FormFieldSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden>
      <Skeleton className={labelClassName} />
      <Skeleton className={inputClassName} />
    </div>
  );
}

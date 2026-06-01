import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { FormFieldSkeleton } from "./FormFieldSkeleton";
import { SkeletonText } from "./SkeletonText";

export interface AuthFormSkeletonProps {
  fieldCount?: number;
  showFooterLink?: boolean;
  showRememberRow?: boolean;
  className?: string;
}

export function AuthFormSkeleton({
  fieldCount = 2,
  showFooterLink = false,
  showRememberRow = true,
  className,
}: AuthFormSkeletonProps) {
  return (
    <div
      className={cn("flex w-full max-w-sm flex-col items-center", className)}
      role="status"
      aria-label="Loading form"
    >
      <Skeleton className="mb-7 h-[72px] w-[120px] rounded-xl" aria-hidden />
      <Skeleton className="mb-3 h-8 w-56 rounded-lg" aria-hidden />
      <Skeleton
        className="mb-6 h-4 w-full max-w-[280px] rounded-md"
        aria-hidden
      />
      <div className="w-full space-y-6">
        {Array.from({ length: fieldCount }).map((_, index) => (
          <FormFieldSkeleton key={index} />
        ))}
        {showRememberRow && (
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-28 rounded-md" aria-hidden />
            <Skeleton className="h-4 w-32 rounded-md" aria-hidden />
          </div>
        )}
        <Skeleton className="h-12 w-full rounded-[30px]" aria-hidden />
      </div>
      {showFooterLink && (
        <SkeletonText
          lines={1}
          className="mt-6 w-full"
          lineClassName="mx-auto h-4 w-64 rounded-md"
        />
      )}
    </div>
  );
}

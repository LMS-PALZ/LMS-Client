import { Skeleton } from "@ssu/ui";

export interface AdminModuleListSkeletonProps {
  count?: number;
}

export function AdminModuleListSkeleton({
  count = 4,
}: AdminModuleListSkeletonProps) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading modules">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="space-y-3 rounded-xl border border-[#EEF2F6] p-4"
          aria-hidden
        >
          <Skeleton className="h-5 w-48 rounded-md" />
          <Skeleton className="h-3 w-32 rounded-md" />
        </div>
      ))}
    </div>
  );
}

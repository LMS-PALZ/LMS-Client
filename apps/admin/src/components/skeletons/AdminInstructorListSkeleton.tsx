import { Skeleton } from "@ssu/ui";

export function AdminInstructorListSkeleton() {
  return (
    <div
      className="space-y-3 py-2"
      role="status"
      aria-label="Loading instructors"
    >
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl border border-[#EEF2F6] p-3"
          aria-hidden
        >
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

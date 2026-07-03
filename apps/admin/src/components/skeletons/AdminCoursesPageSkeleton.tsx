import { DataTableSkeleton, Skeleton } from "@ssu/ui";

export function AdminCoursesPageSkeleton() {
  return (
    <section className="space-y-6" role="status" aria-label="Loading courses">
      <div className="flex items-center justify-between gap-4" aria-hidden>
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-11 w-36 rounded-full" />
      </div>

      <div
        className="flex flex-wrap items-center justify-between gap-4"
        aria-hidden
      >
        <Skeleton className="h-10 w-40 rounded-lg" />
        <Skeleton className="h-10 w-full max-w-xs rounded-lg" />
      </div>

      <DataTableSkeleton rows={8} columns={5} />
    </section>
  );
}

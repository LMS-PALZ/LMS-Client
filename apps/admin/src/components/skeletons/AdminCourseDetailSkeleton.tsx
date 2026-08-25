import { DataTableSkeleton, Skeleton } from "@ssu/ui";

export function AdminCourseDetailSkeleton() {
  return (
    <section className="space-y-6" role="status" aria-label="Loading course">
      <Skeleton className="h-4 w-56 rounded-md" aria-hidden />

      <div
        className="space-y-4 rounded-[18px] border border-[#EEF2F6] bg-white p-6"
        aria-hidden
      >
        <Skeleton className="h-8 w-2/3 max-w-md rounded-lg" />
        <Skeleton className="h-4 w-full max-w-xl rounded-md" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>

      <div className="rounded-[18px] border border-[#EEF2F6] bg-white px-6 py-6">
        <div className="flex gap-4 border-b border-[#EEF2F6] pb-4" aria-hidden>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-md" />
          ))}
        </div>
        <div className="mt-6">
          <DataTableSkeleton
            rows={6}
            columns={5}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </div>
      </div>
    </section>
  );
}

import { DataTableSkeleton, Skeleton, StatCardSkeleton } from "@ssu/ui";

export function AdminStudentDetailSkeleton() {
  return (
    <div
      className="space-y-5"
      role="status"
      aria-label="Loading student details"
    >
      <div className="flex justify-end" aria-hidden>
        <Skeleton className="h-11 w-[220px] rounded-[30px]" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <div className="space-y-4 rounded-[18px] border border-[#EEF2F6] bg-white p-6">
          <Skeleton className="mx-auto h-24 w-24 rounded-full" />
          <Skeleton className="mx-auto h-5 w-40 rounded-md" />
          <Skeleton className="mx-auto h-4 w-32 rounded-md" />
        </div>
        <div className="space-y-4 rounded-[18px] border border-[#EEF2F6] bg-white p-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-between gap-4">
              <Skeleton className="h-4 w-28 rounded-md" />
              <Skeleton className="h-4 w-40 rounded-md" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      <DataTableSkeleton rows={5} columns={4} />
    </div>
  );
}

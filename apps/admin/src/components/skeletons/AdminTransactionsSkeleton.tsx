import { DataTableSkeleton, Skeleton } from "@ssu/ui";

export function AdminTransactionsPageSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading transactions">
      <Skeleton className="h-8 w-40 rounded-lg" aria-hidden />

      <section className="rounded-[20px] bg-[#EEF9ED] p-6 md:p-8" aria-hidden>
        <Skeleton className="h-4 w-28 rounded-md" />
        <Skeleton className="mt-2 h-10 w-48 rounded-lg" />
        <Skeleton className="mt-2 h-4 w-36 rounded-md" />
      </section>

      <section className="rounded-[18px] bg-white p-6">
        <Skeleton className="mb-6 h-6 w-44 rounded-md" />
        <DataTableSkeleton
          rows={8}
          columns={6}
          className="border-0 bg-transparent p-0 shadow-none"
        />
      </section>
    </div>
  );
}

import { DataTableSkeleton } from "@ssu/ui";
import { AdminStatsCardsSkeleton } from "./AdminStatsCardsSkeleton";

export interface AdminTableSectionSkeletonProps {
  showStats?: boolean;
  tableRows?: number;
  tableColumns?: number;
}

export function AdminTableSectionSkeleton({
  showStats = true,
  tableRows = 8,
  tableColumns = 6,
}: AdminTableSectionSkeletonProps) {
  return (
    <section
      className="flex flex-col gap-8 rounded-[18px] bg-white p-6"
      role="status"
      aria-label="Loading table"
    >
      {showStats ? (
        <section className="rounded-[12px] bg-[#FAFAFA] p-2">
          <AdminStatsCardsSkeleton />
        </section>
      ) : null}
      <DataTableSkeleton
        rows={tableRows}
        columns={tableColumns}
        className="border-0 bg-transparent p-0 shadow-none"
      />
    </section>
  );
}

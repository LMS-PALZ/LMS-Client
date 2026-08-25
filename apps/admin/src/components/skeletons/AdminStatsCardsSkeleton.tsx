import { StatCardSkeleton } from "@ssu/ui";

export function AdminStatsCardsSkeleton() {
  return (
    <div
      className="grid gap-4 lg:grid-cols-3"
      role="status"
      aria-label="Loading statistics"
    >
      {Array.from({ length: 3 }).map((_, index) => (
        <StatCardSkeleton key={index} />
      ))}
    </div>
  );
}

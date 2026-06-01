import { cn } from "@ssu/utils";
import { Skeleton } from "../atoms/Skeleton";
import { SkeletonCircle } from "./SkeletonCircle";
import { SkeletonText } from "./SkeletonText";
import { skeletonSectionSurface } from "./utils";

export interface DashboardShellSkeletonProps {
  className?: string;
}

export function DashboardShellSkeleton({
  className,
}: DashboardShellSkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-screen overflow-hidden bg-[#F0F5F1] lg:gap-2",
        className,
      )}
      role="status"
      aria-label="Loading dashboard"
    >
      <aside
        className="hidden w-[260px] flex-shrink-0 p-4 lg:block"
        aria-hidden
      >
        <div className="flex h-full flex-col rounded-2xl bg-white p-4 shadow-card">
          <Skeleton className="mb-8 h-10 w-32 rounded-lg" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-none bg-[#FAFAFA] lg:rounded-[16px]">
        <header className="flex h-[var(--header-height)] flex-shrink-0 items-center justify-between px-4 md:px-6">
          <Skeleton className="h-8 w-40 rounded-lg" aria-hidden />
          <div className="flex items-center gap-3" aria-hidden>
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <SkeletonCircle size="md" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-6xl space-y-6">
            <Skeleton className="h-9 w-64 rounded-lg" aria-hidden />
            <div className="grid gap-6 lg:grid-cols-2">
              <div
                className={cn(
                  skeletonSectionSurface,
                  "min-h-[220px] space-y-4",
                )}
              >
                <SkeletonText lines={3} />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
              <div
                className={cn(
                  skeletonSectionSurface,
                  "min-h-[220px] space-y-4",
                )}
              >
                <Skeleton className="h-6 w-32 rounded-md" />
                <Skeleton className="h-36 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

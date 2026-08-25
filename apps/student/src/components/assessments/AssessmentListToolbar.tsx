"use client";

import { cn } from "@ssu/utils";
import { ChevronDown, Search } from "lucide-react";
import { ASSESSMENT_STATUS_FILTER_OPTIONS } from "@/lib/assignment-display";

export function AssessmentListToolbar({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  className,
}: {
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4",
        className,
      )}
    >
      <div className="relative w-full sm:w-[160px]">
        <select
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-neutral-200 bg-white pl-4 pr-10 text-[13px] font-medium text-neutral-800 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
          aria-label="Filter by status"
        >
          {ASSESSMENT_STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
      </div>

      <div className="relative min-w-0 flex-1">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          aria-hidden
        />
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Search assignment"
          className="h-11 w-full rounded-xl border border-neutral-200 bg-white py-2 pl-11 pr-4 text-[13px] text-neutral-800 shadow-sm placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
        />
      </div>
    </div>
  );
}

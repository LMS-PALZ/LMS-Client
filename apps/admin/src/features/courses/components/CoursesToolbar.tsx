"use client";

import { SearchInput, CustomSelect } from "@ssu/ui";

const STATUS_OPTIONS = ["All statuses", "Published", "Draft"];

interface CoursesToolbarProps {
  count: number;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function CoursesToolbar({
  count,
  statusFilter,
  onStatusFilterChange,
  search,
  onSearchChange,
}: CoursesToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-[14px] text-[#94A3B8]">({count}) Courses</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[180px]">
          <CustomSelect
            placeholder="All statuses"
            options={STATUS_OPTIONS}
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="h-12 rounded-[14px] text-[14px]"
          />
        </div>

        <SearchInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onClear={() => onSearchChange("")}
          placeholder="Search a course"
          className="w-full sm:w-[320px]"
          aria-label="Search courses"
        />
      </div>
    </div>
  );
}

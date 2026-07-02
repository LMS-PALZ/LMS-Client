import { CustomSelect, SearchInput } from "@ssu/ui";
import { STUDENT_STATUS_OPTIONS } from "../../lib/student-utils";

interface StudentsToolbarProps {
  total: number;
  statusFilter: string;
  yearFilter: string;
  yearOptions: string[];
  search: string;
  onStatusFilterChange: (value: string) => void;
  onYearFilterChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSearchClear: () => void;
}

export function StudentsToolbar({
  total,
  statusFilter,
  yearFilter,
  yearOptions,
  search,
  onStatusFilterChange,
  onYearFilterChange,
  onSearchChange,
  onSearchClear,
}: StudentsToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-[14px] font-medium text-[#1D1D1D]">
        ({total}) Students
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:w-[160px]">
          <CustomSelect
            placeholder="All statuses"
            options={[...STUDENT_STATUS_OPTIONS]}
            value={statusFilter}
            onChange={onStatusFilterChange}
            className="h-11 rounded-[14px] text-[14px]"
          />
        </div>
        <div className="w-full sm:w-[120px]">
          <CustomSelect
            placeholder="All years"
            options={yearOptions}
            value={yearFilter}
            onChange={onYearFilterChange}
            className="h-11 rounded-[14px] text-[14px]"
          />
        </div>
        <SearchInput
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          onClear={onSearchClear}
          placeholder="Search a student"
          className="w-full sm:w-[260px]"
          aria-label="Search students"
        />
      </div>
    </div>
  );
}

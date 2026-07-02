import { CustomSelect } from "@ssu/ui";
import { cn } from "@ssu/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { STUDENT_ROWS_PER_PAGE_OPTIONS } from "../../lib/student-utils";

interface StudentsPaginationProps {
  page: number;
  totalPages: number;
  total: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

export function StudentsPagination({
  page,
  totalPages,
  total,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: StudentsPaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, total);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[13px] text-[#94A3B8]">
        Showing {start}-{end} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(page - 1, 1))}
            className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F7F9FB] disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => onPageChange(pageNumber)}
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-medium transition",
                  pageNumber === page
                    ? "bg-[#4C7D5B] text-white"
                    : "text-[#6B7280] hover:bg-[#F7F9FB]",
                )}
              >
                {pageNumber}
              </button>
            );
          })}

          <button
            type="button"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(page + 1, totalPages))}
            className="rounded-lg p-2 text-[#94A3B8] transition hover:bg-[#F7F9FB] disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-[13px] text-[#6B7280]">
          <span>Rows per page</span>
          <div className="w-[72px]">
            <CustomSelect
              placeholder="10"
              options={[...STUDENT_ROWS_PER_PAGE_OPTIONS]}
              value={String(rowsPerPage)}
              onChange={(value) => {
                onRowsPerPageChange(Number(value));
                onPageChange(1);
              }}
              className="h-9 rounded-[10px] text-[13px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

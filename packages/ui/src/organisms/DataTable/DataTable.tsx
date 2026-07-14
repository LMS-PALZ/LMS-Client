"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { cn } from "@ssu/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";
import { CustomSelect } from "../../molecules/CustomSelect";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId?: (originalRow: TData, index: number) => string;

  searchable?: boolean;

  statusOptions?: string[];
  roleOptions?: string[];
  courseOptions?: string[];

  pagination?: {
    page: number;
    totalPages: number;
    total?: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  searchValue?: string;
  onSearchChange?: (value: string) => void;

  statusFilter?: string;
  onStatusFilterChange?: (value: string) => void;

  roleFilter?: string;
  onRoleFilterChange?: (value: string) => void;

  courseFilter?: string;
  onCourseFilterChange?: (value: string) => void;

  onPageChange?: (page: number) => void;

  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowId,

  searchable,

  searchValue,
  onSearchChange,

  statusFilter,
  onStatusFilterChange,

  roleFilter,
  onRoleFilterChange,

  courseFilter,
  onCourseFilterChange,

  statusOptions,
  roleOptions,
  courseOptions,

  pagination,
  onPageChange,

  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const tableColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
  });

  const totalPagesLabel =
    pagination?.totalPages && pagination.totalPages > 0
      ? pagination.totalPages
      : Math.max(1, data.length > 0 ? 1 : 0) || 1;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        {searchable && (
          <Input
            placeholder="Search..."
            value={searchValue ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        )}
        {roleOptions && (
          <div className="w-[300px]">
            <CustomSelect
              className="h-[40px] rounded-[11px]"
              placeholder="All Role"
              options={roleOptions}
              value={roleFilter ?? ""}
              onChange={(value) => onRoleFilterChange?.(value)}
            />
          </div>
        )}

        {courseOptions && (
          <div className="w-[300px]">
            <CustomSelect
              className="h-[40px] rounded-[11px]"
              placeholder="All Course"
              options={courseOptions}
              value={courseFilter ?? ""}
              onChange={(value) => onCourseFilterChange?.(value)}
            />
          </div>
        )}

        {statusOptions && (
          <div className="w-[300px]">
            <CustomSelect
              className="h-[40px] rounded-[11px]"
              placeholder="All Status"
              options={statusOptions}
              value={statusFilter ?? ""}
              onChange={(value) => onStatusFilterChange?.(value)}
            />
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white shadow-card">
        <table className="w-full text-left text-body">
          <thead className="border-b bg-neutral-50">
            {table?.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 font-semibold text-neutral-700"
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="inline-flex items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {header.column.getIsSorted() === "asc" && (
                          <ChevronUp className="h-4 w-4" aria-hidden />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ChevronDown className="h-4 w-4" aria-hidden />
                        )}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b last:border-0 hover:bg-neutral-50"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-neutral-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-small text-neutral-500">
          Page {pagination?.page ?? 1} of{" "}
          {pagination?.totalPages && pagination.totalPages > 0
            ? pagination.totalPages
            : totalPagesLabel}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange?.((pagination?.page ?? 1) - 1)}
            disabled={!pagination?.hasPreviousPage}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange?.((pagination?.page ?? 1) + 1)}
            disabled={!pagination?.hasNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

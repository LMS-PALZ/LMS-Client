"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { cn } from "@ssu/utils";
import { CustomSelect } from "@ssu/ui";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "../../atoms/Button";
import { Input } from "../../atoms/Input";

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchable?: boolean;
  statusOptions?: string[];
  roleOptions?: string[];
  courseOptions?: string[];
  className?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchable,
  className,
  statusOptions,
  roleOptions,
  courseOptions,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      const item = row as Record<string, string>;

      const statusMatch =
        !statusFilter || statusFilter === "All" || item.status === statusFilter;

      const roleMatch =
        !roleFilter || roleFilter === "All" || item.role === roleFilter;

      const courseMatch =
        !courseFilter || courseFilter === "All" || item.course === courseFilter;

      return statusMatch && roleMatch && courseMatch;
    });
  }, [data, statusFilter, roleFilter, courseFilter]);

  const tableColumns = useMemo(() => columns, [columns]);

  const table = useReactTable({
    data: filteredData,
    columns: tableColumns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: "includesString",
  });

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-3">
        {searchable && (
          <Input
            placeholder="Search student..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="min-w-[250px]"
          />
        )}
        {roleOptions && (
          <div className="w-[300px]">
            <CustomSelect
              placeholder="All Role"
              options={roleOptions}
              value={roleFilter}
              onChange={setRoleFilter}
            />
          </div>
        )}

        {courseOptions && (
          <div className="w-[300px]">
            <CustomSelect
              placeholder="All Course"
              options={courseOptions}
              value={courseFilter}
              onChange={setCourseFilter}
            />
          </div>
        )}

        {statusOptions && (
          <div className="w-[300px]">
            <CustomSelect
              placeholder="All Status"
              options={statusOptions}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        )}
      </div>
      <div className="overflow-x-auto rounded-xl border bg-white shadow-card">
        <table className="w-full text-left text-body">
          <thead className="border-b bg-neutral-50">
            {table.getHeaderGroups().map((hg) => (
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
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

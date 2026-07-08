"use client";

import type { AdminTransaction } from "@ssu/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

interface TransactionsTableProps {
  transactions: AdminTransaction[];
  pagination?: {
    page: number;
    totalPages: number;
    total?: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  search: string;
  setSearch: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  setPage: (page: number) => void;
  onSelectTransaction: (transaction: AdminTransaction) => void;
}

export function TransactionsTable({
  transactions,
  pagination,
  search,
  setSearch,
  status,
  setStatus,
  dateFilter,
  setDateFilter,
  setPage,
  onSelectTransaction,
}: TransactionsTableProps) {
  const columns = useMemo<ColumnDef<AdminTransaction>[]>(
    () => [
      { accessorKey: "transactionId", header: "Transaction ID" },
      { accessorKey: "studentName", header: "Student" },
      { accessorKey: "courseTitle", header: "Course" },
      { accessorKey: "paymentMethod", header: "Payment method" },
      { accessorKey: "status", header: "Status" },
      { accessorKey: "amount", header: "Amount" },
      { accessorKey: "createdAt", header: "Date & Time" },
    ],
    [],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 min-w-[160px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[14px] text-[#1D1D1D]"
        >
          <option>All statuses</option>
          <option>success</option>
          <option>failed</option>
          <option>pending</option>
          <option>cancelled</option>
        </select>

        <select
          value={dateFilter}
          onChange={(event) => setDateFilter(event.target.value)}
          className="h-11 min-w-[140px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-[14px] text-[#1D1D1D]"
        >
          <option>All time</option>
          <option>Today</option>
          <option>This week</option>
          <option>This month</option>
        </select>

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search for a student or transaction ID"
          className="h-11 min-w-[280px] flex-1 rounded-[12px] border border-[#E5E7EB] px-4 text-[14px] text-[#1D1D1D] placeholder:text-[#9CA3AF]"
        />
      </div>

      <div className="overflow-hidden rounded-[16px] border border-[#EEF2F6]">
        <table className="w-full text-left text-[14px]">
          <thead className="border-b bg-[#FAFAFA] text-[13px] text-[#6B7280]">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.header)}
                  className="px-4 py-3 font-medium"
                >
                  {typeof column.header === "string" ? column.header : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-[#6B7280]"
                >
                  No transactions found.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  onClick={() => onSelectTransaction(transaction)}
                  className="cursor-pointer border-b last:border-0 transition hover:bg-[#F7F9FB]"
                >
                  <td className="px-4 py-4 font-medium text-[#1D1D1D]">
                    {transaction.transactionId}
                  </td>
                  <td className="px-4 py-4">{transaction.studentName}</td>
                  <td className="px-4 py-4">{transaction.courseTitle}</td>
                  <td className="px-4 py-4">{transaction.paymentMethod}</td>
                  <td className="px-4 py-4">
                    <TransactionStatusBadge status={transaction.status} />
                  </td>
                  <td className="px-4 py-4">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </td>
                  <td className="px-4 py-4">
                    {formatDateTime(transaction.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-4 text-[13px] text-[#6B7280]">
        <p>
          Showing{" "}
          {pagination?.total
            ? `${(pagination.page - 1) * 10 + 1}-${Math.min(pagination.page * 10, pagination.total)} of ${pagination.total}`
            : "0 transactions"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!pagination?.hasPreviousPage}
            onClick={() => setPage((pagination?.page ?? 1) - 1)}
            className="rounded-full border border-[#E5E7EB] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!pagination?.hasNextPage}
            onClick={() => setPage((pagination?.page ?? 1) + 1)}
            className="rounded-full border border-[#E5E7EB] px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

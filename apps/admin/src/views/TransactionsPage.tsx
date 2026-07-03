"use client";

import { useAdminTransactionDetail, useAdminTransactions } from "@ssu/queries";
import type { AdminTransaction } from "@ssu/types";
import { EmptyState, PageHeader } from "@ssu/ui";
import { Receipt } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { TransactionDetailsModal } from "@/components/transactions/TransactionDetailsModal";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { AdminTransactionsPageSkeleton } from "@/components/skeletons";
import { DataTableSkeleton } from "@ssu/ui";

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function TransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [dateFilter, setDateFilter] = useState("All time");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [status, dateFilter]);

  const { data, isLoading, isError, error } = useAdminTransactions({
    page,
    limit: 10,
    search: debouncedSearch,
    status,
    dateFilter,
  });

  const detailQuery = useAdminTransactionDetail(selectedId);

  const revenueAvailable = data?.meta != null;
  const totalRevenue = data?.meta?.totalRevenue ?? 0;
  const revenueThisMonth = data?.meta?.revenueThisMonth ?? 0;

  const pagination = useMemo(
    () =>
      data?.pagination
        ? {
            page: data.pagination.page,
            totalPages: data.pagination.totalPages,
            total: data.pagination.total,
            hasNextPage: data.pagination.hasNextPage,
            hasPreviousPage: data.pagination.hasPreviousPage,
          }
        : undefined,
    [data?.pagination],
  );

  const handleSelectTransaction = (transaction: AdminTransaction) => {
    setSelectedId(transaction.id);
    setModalOpen(true);
  };

  const handleModalChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) setSelectedId(null);
  };

  if (isLoading && !data) {
    return <AdminTransactionsPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" />

      <section className="rounded-[20px] bg-[#EEF9ED] p-6 md:p-8">
        <p className="text-[14px] font-medium text-[#4A4F59]">Total Revenue</p>
        {revenueAvailable ? (
          <>
            <p className="mt-2 text-[32px] font-bold text-[#1D1D1D] md:text-[40px]">
              {formatCurrency(totalRevenue)}
            </p>
            {revenueThisMonth > 0 && (
              <p className="mt-2 text-[14px] text-[#4E845F]">
                +{formatCurrency(revenueThisMonth)} this month
              </p>
            )}
          </>
        ) : (
          <>
            <p className="mt-2 text-[32px] font-bold text-[#1D1D1D] md:text-[40px]">
              —
            </p>
            <p className="mt-2 text-[14px] text-[#6B7280]">
              No revenue data available
            </p>
          </>
        )}
      </section>

      <section className="rounded-[18px] bg-white p-6">
        <h2 className="mb-6 text-[18px] font-semibold text-[#1D1D1D]">
          ({pagination?.total ?? data?.items.length ?? 0}) Transactions
        </h2>

        {isLoading ? (
          <DataTableSkeleton
            rows={8}
            columns={6}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        ) : isError ? (
          <EmptyState
            icon={Receipt}
            title="Could not load transactions"
            description={
              error instanceof Error
                ? error.message
                : "Please refresh and try again."
            }
          />
        ) : (
          <TransactionsTable
            transactions={data?.items ?? []}
            pagination={pagination}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            setPage={setPage}
            onSelectTransaction={handleSelectTransaction}
          />
        )}
      </section>

      <TransactionDetailsModal
        open={modalOpen}
        onOpenChange={handleModalChange}
        transaction={detailQuery.data}
        isLoading={detailQuery.isLoading}
        errorMessage={
          detailQuery.isError && detailQuery.error instanceof Error
            ? detailQuery.error.message
            : undefined
        }
      />
    </div>
  );
}

"use client";

import type { AdminTransactionDetail } from "@ssu/types";
import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@ssu/utils";
import { X } from "lucide-react";
import type { ReactNode } from "react";
import { TransactionStatusBadge } from "./TransactionStatusBadge";

function formatCurrency(amount: number, currency = "NGN") {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-[#EEF2F6] py-3 last:border-b-0">
      <span className="shrink-0 text-[14px] text-[#6B7280]">{label}</span>
      <span className="text-right text-[14px] font-medium text-[#1D1D1D]">
        {value}
      </span>
    </div>
  );
}

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[16px] bg-[#F8FAFC] px-4 py-1">
      <h3 className="border-b border-[#EEF2F6] py-3 text-[14px] font-semibold text-[#1D1D1D]">
        {title}
      </h3>
      {children}
    </section>
  );
}

interface TransactionDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: AdminTransactionDetail;
  isLoading?: boolean;
  errorMessage?: string;
}

export function TransactionDetailsModal({
  open,
  onOpenChange,
  transaction,
  isLoading,
  errorMessage,
}: TransactionDetailsModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-[480px] -translate-x-1/2 -translate-y-1/2",
            "overflow-hidden rounded-[24px] bg-white shadow-xl focus:outline-none",
          )}
        >
          <div className="flex items-center justify-between border-b border-[#F3F4F6] px-6 py-4">
            <Dialog.Title className="text-[18px] font-semibold text-[#1D1D1D]">
              Transaction details
            </Dialog.Title>
            <Dialog.Close
              className="rounded-full p-2 text-[#6B7280] transition hover:bg-[#F4F4F5]"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Dialog.Close>
          </div>

          <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
            {isLoading ? (
              <div className="flex min-h-[240px] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#D4E2D8] border-t-[#4E845F]" />
              </div>
            ) : errorMessage ? (
              <p className="py-12 text-center text-[14px] text-[#6B7280]">
                {errorMessage}
              </p>
            ) : transaction ? (
              <div className="space-y-5">
                <div className="text-center">
                  <p className="text-[32px] font-bold leading-tight text-[#1D1D1D]">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <div className="mt-3 flex justify-center">
                    <TransactionStatusBadge status={transaction.status} />
                  </div>
                </div>

                <DetailSection title="Payer's information">
                  <DetailRow label="Name" value={transaction.studentName} />
                  <DetailRow
                    label="Email"
                    value={transaction.studentEmail || "—"}
                  />
                  <DetailRow
                    label="Phone number"
                    value={transaction.studentPhone || "—"}
                  />
                </DetailSection>

                <DetailSection title="Transaction information">
                  <DetailRow
                    label="Transaction ID"
                    value={transaction.transactionId}
                  />
                  <DetailRow
                    label="Date"
                    value={formatDateTime(transaction.createdAt)}
                  />
                  <DetailRow
                    label="Payment method"
                    value={
                      transaction.paymentMethod !== "—"
                        ? transaction.paymentMethod
                        : "—"
                    }
                  />
                  <DetailRow label="Type" value={transaction.type || "—"} />
                  <DetailRow label="Item" value={transaction.item || "—"} />
                </DetailSection>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end border-t border-[#F3F4F6] px-6 py-4">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full bg-[#4C7D5B] px-8 py-2.5 text-[14px] font-medium text-white transition hover:bg-[#3D6E4D]"
            >
              Close
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

import type { TransactionStatus } from "@ssu/types";
import { cn } from "@ssu/utils";

const STATUS_STYLES: Record<TransactionStatus, string> = {
  success: "bg-[#DFF2E1] text-[#2E7D32]",
  failed: "bg-[#FDE2DF] text-[#D32F2F]",
  pending: "bg-[#FFDFC5] text-[#F49221]",
  cancelled: "bg-[#E9EEF5] text-[#5F6B7A]",
  canceled: "bg-[#E9EEF5] text-[#5F6B7A]",
};

const STATUS_LABELS: Record<TransactionStatus, string> = {
  success: "Success",
  failed: "Failed",
  pending: "Pending",
  cancelled: "Canceled",
  canceled: "Canceled",
};

export function TransactionStatusBadge({
  status,
  className,
}: {
  status: TransactionStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium capitalize",
        STATUS_STYLES[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}

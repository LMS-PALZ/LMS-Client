import {
  getAdminTransaction,
  listAdminTransactions,
  type ListAdminTransactionsParams,
} from "@ssu/api";
import { useQuery } from "@tanstack/react-query";

export function useAdminTransactions(params: ListAdminTransactionsParams) {
  return useQuery({
    queryKey: ["admin-transactions", params],
    queryFn: async () => {
      const res = await listAdminTransactions(params);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
  });
}

export function useAdminTransactionDetail(transactionId: string | null) {
  return useQuery({
    queryKey: ["admin-transaction", transactionId],
    enabled: Boolean(transactionId),
    queryFn: async () => {
      const res = await getAdminTransaction(transactionId!);
      if (!res.ok) throw new Error(res.message);
      return res.data;
    },
  });
}

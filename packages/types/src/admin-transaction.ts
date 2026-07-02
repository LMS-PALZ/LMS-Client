export type TransactionStatus =
  | "success"
  | "failed"
  | "pending"
  | "cancelled"
  | "canceled";

export interface AdminTransaction {
  id: string;
  transactionId: string;
  studentName: string;
  courseTitle: string;
  paymentMethod: string;
  status: TransactionStatus;
  amount: number;
  currency: string;
  createdAt: string;
}

export interface AdminTransactionDetail extends AdminTransaction {
  studentEmail?: string;
  studentPhone?: string;
  type?: string;
  item?: string;
}

export interface AdminTransactionPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface AdminTransactionListMeta {
  totalRevenue?: number;
  revenueThisMonth?: number;
}

export interface AdminTransactionListResult {
  items: AdminTransaction[];
  pagination: AdminTransactionPagination;
  meta?: AdminTransactionListMeta;
}

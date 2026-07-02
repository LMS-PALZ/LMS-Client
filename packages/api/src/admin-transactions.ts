import axios from "axios";
import type {
  AdminTransaction,
  AdminTransactionDetail,
  AdminTransactionListResult,
  TransactionStatus,
} from "@ssu/types";
import { getStoredAuthToken } from "./student-login";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://base-api.skillscaleup.org";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function readString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function readNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim()) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
}

function normalizeStatus(value: unknown): TransactionStatus {
  const normalized = String(value ?? "pending")
    .toLowerCase()
    .trim();
  if (normalized === "success" || normalized === "successful") return "success";
  if (normalized === "failed" || normalized === "failure") return "failed";
  if (normalized === "pending") return "pending";
  if (normalized === "cancelled" || normalized === "canceled") {
    return normalized === "canceled" ? "canceled" : "cancelled";
  }
  return "pending";
}

function readStudentName(student: Record<string, unknown> | null): string {
  if (!student) return "—";
  const fullName = readString(student, "fullName", "name");
  if (fullName) return fullName;
  const firstName = readString(student, "firstName", "first_name");
  const lastName = readString(student, "lastName", "last_name");
  return [firstName, lastName].filter(Boolean).join(" ") || "—";
}

function mapTransaction(record: Record<string, unknown>): AdminTransaction {
  const student = asRecord(record.student);
  const program = asRecord(record.program);

  return {
    id: readString(record, "id", "_id", "transactionId"),
    transactionId: readString(
      record,
      "transactionId",
      "reference",
      "txnId",
      "id",
      "_id",
    ),
    studentName: readStudentName(student),
    courseTitle:
      (program ? readString(program, "title", "name") : "") ||
      readString(record, "programTitle", "courseTitle", "item"),
    paymentMethod:
      readString(record, "paymentMethod", "payment_method", "channel") || "—",
    status: normalizeStatus(record.status),
    amount: readNumber(record, "amount", "totalAmount", "total"),
    currency: readString(record, "currency") || "NGN",
    createdAt:
      readString(record, "createdAt", "created_at", "paidAt", "paid_at") ||
      new Date().toISOString(),
  };
}

function mapTransactionDetail(
  record: Record<string, unknown>,
): AdminTransactionDetail {
  const base = mapTransaction(record);
  const student = asRecord(record.student);
  const program = asRecord(record.program);

  return {
    ...base,
    studentEmail:
      (student ? readString(student, "email") : "") ||
      readString(record, "studentEmail"),
    studentPhone:
      (student
        ? readString(student, "phoneNumber", "phone_number", "phone")
        : "") || readString(record, "studentPhone"),
    type: readString(record, "type", "transactionType") || "Course enrolment",
    item:
      readString(record, "item", "itemTitle") ||
      (program ? readString(program, "title", "name") : "") ||
      base.courseTitle,
  };
}

function mapPagination(
  record: Record<string, unknown> | null,
  fallbackPage: number,
  fallbackLimit: number,
  itemCount: number,
): AdminTransactionListResult["pagination"] {
  const page = readNumber(record ?? {}, "page") || fallbackPage;
  const limit = readNumber(record ?? {}, "limit") || fallbackLimit;
  const total =
    readNumber(record ?? {}, "total", "totalItems", "count") || itemCount;
  const totalPages =
    readNumber(record ?? {}, "totalPages", "total_pages") ||
    Math.max(1, Math.ceil(total / Math.max(limit, 1)));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

function mapListResponse(
  payload: unknown,
  page: number,
  limit: number,
): AdminTransactionListResult {
  const root = asRecord(payload) ?? {};
  const data = asRecord(root.data) ?? root;
  const itemsSource =
    (Array.isArray(data.items) && data.items) ||
    (Array.isArray(data.transactions) && data.transactions) ||
    (Array.isArray(data.records) && data.records) ||
    [];

  const items = itemsSource
    .map((item) => asRecord(item))
    .filter((item): item is Record<string, unknown> => Boolean(item))
    .map(mapTransaction);

  const metaRecord =
    asRecord(data.meta) ??
    asRecord(data.summary) ??
    asRecord(data.stats) ??
    asRecord(root.meta) ??
    null;

  const totalRevenue =
    readNumber(data, "totalRevenue", "total_revenue") ||
    readNumber(metaRecord ?? {}, "totalRevenue", "total_revenue");
  const revenueThisMonth =
    readNumber(
      data,
      "revenueThisMonth",
      "revenue_this_month",
      "monthlyRevenue",
    ) ||
    readNumber(
      metaRecord ?? {},
      "revenueThisMonth",
      "revenue_this_month",
      "monthlyRevenue",
    );

  const hasRevenueMeta =
    totalRevenue > 0 ||
    revenueThisMonth > 0 ||
    (metaRecord != null &&
      ("totalRevenue" in metaRecord ||
        "total_revenue" in metaRecord ||
        "revenueThisMonth" in metaRecord ||
        "revenue_this_month" in metaRecord)) ||
    "totalRevenue" in data ||
    "total_revenue" in data;

  return {
    items,
    pagination: mapPagination(
      asRecord(data.pagination),
      page,
      limit,
      items.length,
    ),
    meta: hasRevenueMeta
      ? {
          totalRevenue,
          revenueThisMonth,
        }
      : undefined,
  };
}

export interface ListAdminTransactionsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  dateFilter?: string;
}

export async function listAdminTransactions(
  params: ListAdminTransactionsParams = {},
) {
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;

  try {
    const token = getStoredAuthToken();
    const query: Record<string, string | number> = { page, limit };

    if (params.search?.trim()) query.search = params.search.trim();
    if (params.status && params.status !== "All statuses") {
      query.status = params.status.toLowerCase();
    }
    if (params.dateFilter && params.dateFilter !== "All time") {
      query.date = params.dateFilter.toLowerCase();
    }

    const res = await axios.get(`${API_BASE_URL}/api/v1/admins/transactions`, {
      params: query,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      ok: true as const,
      data: mapListResponse(res.data, page, limit),
      message: readString(asRecord(res.data) ?? {}, "message"),
    };
  } catch (error: unknown) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.message
        ? String(error.response.data.message)
        : "Failed to fetch transactions.";
    return { ok: false as const, message };
  }
}

export async function getAdminTransaction(transactionId: string) {
  try {
    const token = getStoredAuthToken();

    const res = await axios.get(
      `${API_BASE_URL}/api/v1/admins/transactions/${encodeURIComponent(transactionId)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const root = asRecord(res.data) ?? {};
    const data = asRecord(root.data) ?? asRecord(root.transaction) ?? root;

    return {
      ok: true as const,
      data: mapTransactionDetail(data),
      message: readString(root, "message"),
    };
  } catch (error: unknown) {
    const message =
      axios.isAxiosError(error) && error.response?.data?.message
        ? String(error.response.data.message)
        : "Failed to fetch transaction details.";
    return { ok: false as const, message };
  }
}

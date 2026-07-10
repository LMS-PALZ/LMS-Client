"use client";

import { DataTable, StatusBadge } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { Admins } from "@ssu/types";
import { useMemo, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { StatusDialog } from "@/components/StatusDialog";
import { useAdminModal } from "@ssu/ui";
import { useUpdateStaffStatusMutation } from "@ssu/queries";

const AVATAR_COLORS = [
  "bg-[#86EFAC] text-[#033207]",
  "bg-[#E2E8F0] text-[#033207]",
  "bg-[#2BADFF] text-[#033207]",
  "bg-[#F87171] text-[#033207]",
  "bg-[#FCE4EC] text-[#033207]",
  "bg-[#86EFAC] text-[#033207]",
  "bg-[#FFF8E1] text-[#033207]",
  "bg-[#EDE7F6] text-[#033207]",
];

function getInitials(name: string): string {
  if (!name) return "";

  const parts = name.trim().split(" ");

  const first = parts[0]?.charAt(0).toUpperCase() ?? "";
  const last =
    parts.length > 1 ? parts[parts.length - 1]?.charAt(0).toUpperCase() : "";

  return `${first}${last}`;
}
function getAvatarColor(): string {
  const index = Math.floor(Math.random() * AVATAR_COLORS.length);
  return AVATAR_COLORS[index];
}

interface AdminsTableProps {
  admins: Admins[];

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

  setPage: (page: number) => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AdminTable({
  admins,
  pagination,
  search,
  setSearch,
  status,
  setStatus,
  setPage,
}: AdminsTableProps) {
  const { openModal, closeModal } = useAdminModal();
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const updateStaffStatus = useUpdateStaffStatusMutation();

  const handleStatusChange = (trainer: Admins) => {
    const isSuspended = trainer.status === "suspended";
    const nextStatus = isSuspended
      ? !trainer.inviteAcceptedAt
        ? "invited"
        : "active"
      : "suspended";

    const actionLabel = isSuspended ? "Activate" : "Suspend";
    const confirmVariant = isSuspended ? "primary" : "danger";

    openModal(
      `${actionLabel}`,
      <StatusDialog
        variant="confirm"
        title={`${actionLabel} ${trainer.name}?`}
        confirmVariant={confirmVariant}
        description={
          isSuspended
            ? "They will regain access to the dashboard."
            : "They will lose access to the dashboard until reinstated."
        }
        confirmLabel={actionLabel}
        onCancel={closeModal}
        onConfirm={async () => {
          await updateStaffStatus.mutateAsync({
            userId: trainer.id,
            status: nextStatus,
          });

          openModal(
            "",
            <StatusDialog
              variant="success"
              title={`${actionLabel}d successfully`}
              description={`${trainer.name}'s status has been updated.`}
              onDismiss={closeModal}
            />,
          );
        }}
      />,
    );
  };

  const avatarColors = useMemo(
    () =>
      admins.reduce<Record<string, string>>((acc, admin) => {
        acc[admin.id] = getAvatarColor();
        return acc;
      }, {}),
    [admins],
  );

  const columns: ColumnDef<Admins, any>[] = [
    {
      accessorKey: "name",
      header: "Admin",
      cell: ({ row }) => {
        const { name, id } = row.original;
        const initials = getInitials(name);
        const avatarColor = avatarColors[id] ?? AVATAR_COLORS[0];

        return (
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold ${avatarColor}`}
            >
              {initials}
            </span>
            <span>{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "course",
      header: "Role",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">{row.original.role}</span>
        </div>
      ),
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },

    {
      accessorKey: "date",
      header: "Date Joined",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {formatDate(row.original.inviteAcceptedAt)}
          </span>
        </div>
      ),
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const trainer = row.original;
        const isSuspended = trainer.status === "suspended";

        return (
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setOpenDropdownId(
                  openDropdownId === trainer.id ? null : trainer.id,
                )
              }
            >
              <EllipsisVertical className="h-5 w-5" />
            </button>

            {openDropdownId === trainer.id && (
              <div className="absolute right-0 z-50 mt-2 w-[180px] rounded-lg border bg-white p-2 shadow-lg">
                <button
                  type="button"
                  className={`w-full rounded-md px-3 py-2 text-left text-[14px] hover:bg-gray-100 ${
                    isSuspended ? "text-[#4E845F]" : "text-[#C62828]"
                  }`}
                  onClick={() => {
                    setOpenDropdownId(null);
                    handleStatusChange(trainer);
                  }}
                >
                  {isSuspended ? "Activate" : "Suspend"}
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={admins ?? []}
      pagination={pagination}
      searchValue={search}
      onSearchChange={setSearch}
      statusFilter={status}
      onStatusFilterChange={setStatus}
      onPageChange={setPage}
      searchable
      statusOptions={["All", "active", "suspended", "pending"]}
    />
  );
}

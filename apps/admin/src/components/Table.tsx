"use client";

import { DataTable, StatusBadge, useAdminModal } from "@ssu/ui";
import type { ColumnDef } from "@tanstack/react-table";
import type { Student } from "@ssu/types";
import { useMemo, useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";
import {
  getErrorMessage,
  mutationToast,
  useUpdateStudentStatusMutation,
} from "@ssu/queries";
import { StatusDialog } from "@/components/StatusDialog";
import { displayName, displayValue, EMPTY_DISPLAY } from "@ssu/utils";

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

function formatOnboardingStage(value?: string | null): string {
  const raw = String(value ?? "").trim();
  if (!raw) return EMPTY_DISPLAY;
  return raw
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

interface StudentsTableProps {
  students: Student[];

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

  role: string;
  setRole: (value: string) => void;

  setPage: (page: number) => void;
  emptyMessage?: string;
}

function StudentActions({ student }: { student: Student }) {
  const { openModal, closeModal } = useAdminModal();
  const updateStudentStatus = useUpdateStudentStatusMutation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isSuspended = String(student.status).toLowerCase() === "suspended";
  const actionLabel = isSuspended ? "Activate" : "Suspend";
  const nextStatus = isSuspended ? "active" : "suspended";
  const fullName = `${student.firstName} ${student.lastName}`.trim();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = () => {
    setOpen(false);
    openModal(
      actionLabel,
      <StatusDialog
        variant="confirm"
        confirmVariant={isSuspended ? "primary" : "danger"}
        title={`${actionLabel} ${fullName}?`}
        description={
          isSuspended
            ? "They will regain access to the student portal."
            : "They will lose access to the student portal until reinstated."
        }
        confirmLabel={actionLabel}
        onCancel={closeModal}
        onConfirm={async () => {
          try {
            await updateStudentStatus.mutateAsync({
              userId: student.id,
              status: nextStatus,
            });
            closeModal();
            openModal(
              "",
              <StatusDialog
                variant="success"
                title={`${actionLabel}d successfully`}
                description={`${fullName}'s status has been updated.`}
                onDismiss={closeModal}
              />,
            );
          } catch (error) {
            mutationToast.error(
              getErrorMessage(error, "Failed to update student status."),
            );
          }
        }}
      />,
    );
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="text-[13px] text-[#4E845F] hover:opacity-80"
        aria-label="Student actions"
      >
        <EllipsisVertical />
      </button>
      {open ? (
        <div className="absolute bottom-full right-0 z-50 mb-2 w-[150px] rounded-[12px] border border-[#E8EDF5] bg-white py-1 shadow-lg">
          <button
            type="button"
            onClick={handleAction}
            className={`w-full px-4 py-2.5 text-left text-[14px] hover:bg-[#F7F9FB] ${
              isSuspended ? "text-[#1D1D1D]" : "text-[#C62828]"
            }`}
          >
            {actionLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function Table({
  students,
  pagination,
  search,
  setSearch,
  status,
  setStatus,
  role,
  setRole,
  setPage,
  emptyMessage = "No students found.",
}: StudentsTableProps) {
  const router = useRouter();

  const avatarColors = useMemo(
    () =>
      students.reduce<Record<string, string>>((acc, student) => {
        acc[student.id] = getAvatarColor();
        return acc;
      }, {}),
    [students],
  );

  const columns: ColumnDef<Student, any>[] = [
    {
      accessorKey: "name",
      header: "Student",
      cell: ({ row }) => {
        const { firstName, lastName, id } = row.original;
        const fullName = displayName(firstName, lastName);
        const initials = getInitials(
          fullName === EMPTY_DISPLAY ? "" : fullName,
        );
        const avatarColor = avatarColors[id] ?? AVATAR_COLORS[0];

        return (
          <div className="flex items-center gap-3">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-semibold ${avatarColor}`}
            >
              {initials}
            </span>
            <span>{fullName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "program",
      header: "Program",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {displayValue(row.original.programTitle)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "onboardingProgress",
      header: "Onboarding",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <span className="text-sm">
            {formatOnboardingStage(row.original.onboardingProgress)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => <StudentActions student={row.original} />,
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={students ?? []}
      pagination={pagination}
      searchValue={search}
      onSearchChange={setSearch}
      statusFilter={status}
      onStatusFilterChange={setStatus}
      roleFilter={role}
      onRoleFilterChange={setRole}
      onPageChange={setPage}
      onRowClick={(row) => router.push(`/students/${row.id}`)}
      searchable
      statusOptions={["All", "active", "pending", "suspended"]}
      emptyMessage={emptyMessage}
    />
  );
}

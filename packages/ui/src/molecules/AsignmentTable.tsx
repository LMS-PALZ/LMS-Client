"use client";

import type { ColumnDef } from "@tanstack/react-table";
import type { StaffAssignment } from "@ssu/types";
import { useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  getErrorMessage,
  mutationToast,
  useArchiveAssessmentMutation,
  useDraftAssessmentMutation,
  usePublishAssessmentMutation,
} from "@ssu/queries";
import { StatusBadge } from "../atoms/StatusBadge";
import { DataTable } from "../organisms/DataTable";
import { useAdminModal } from "../contexts/AdminModalProvider";
import { Button } from "../atoms/Button";

interface StudentsTableProps {
  students: StaffAssignment[];
  programId: string;
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
  isLoading?: boolean;
  /** Tutors + super admins can edit/delete; plain admins are view-only. */
  canManageAssessments?: boolean;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ConfirmDeleteDialog({
  title,
  onCancel,
  onConfirm,
  isDeleting,
}: {
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}) {
  return (
    <div className="space-y-5 px-1 py-2">
      <div>
        <h2 className="text-[18px] font-semibold text-[#1D1D1D]">
          Delete this assessment
        </h2>
        <p className="mt-2 text-[14px] leading-6 text-[#6B7280]">
          Please confirm that you want to delete &quot;{title}&quot;. It will be
          removed from the assessment list.
        </p>
      </div>
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isDeleting}
          className="h-11 rounded-full bg-[#ECF0F6] px-6 text-[14px] font-medium text-[#1D1D1D]"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          disabled={isDeleting}
          className="h-11 rounded-full bg-[#C62828] px-6 text-[14px] font-medium text-white hover:bg-[#A61F1F]"
        >
          {isDeleting ? "Deleting..." : "Yes, delete"}
        </Button>
      </div>
    </div>
  );
}

function ActionDropdown({
  assessment,
  programId,
  canManageAssessments = true,
}: {
  assessment: StaffAssignment;
  programId: string;
  canManageAssessments?: boolean;
}) {
  const router = useRouter();
  const { openModal, closeModal } = useAdminModal();
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(
    null,
  );
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const archive = useArchiveAssessmentMutation(programId);
  const publish = usePublishAssessmentMutation(programId);
  const draft = useDraftAssessmentMutation(programId);
  const status = String(assessment.status ?? "").toLowerCase();
  const isPublished = status === "published";
  const isDraft = status === "draft";
  const isArchived = status === "archive" || status === "archived";

  const updateMenuPosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    // Open above the three-dot button.
    setMenuPos({
      top: rect.top - 8,
      right: window.innerWidth - rect.right,
    });
  };

  useEffect(() => {
    if (!open) return;

    updateMenuPosition();

    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    }

    function handleReposition() {
      updateMenuPosition();
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open]);

  const handleEdit = () => {
    setOpen(false);
    localStorage.setItem("editAssessment", JSON.stringify(assessment));
    router.push(`/createassignment?edit=${assessment._id}`);
  };

  const handlePublish = async () => {
    setOpen(false);
    await publish.mutateAsync(assessment._id);
  };

  const handleUnpublish = async () => {
    setOpen(false);
    await draft.mutateAsync(assessment._id);
  };

  const handleDelete = () => {
    setOpen(false);
    openModal(
      "Delete assessment",
      <ConfirmDeleteDialog
        title={assessment.title}
        onCancel={closeModal}
        isDeleting={archive.isPending}
        onConfirm={async () => {
          try {
            await archive.mutateAsync(assessment._id);
            mutationToast.success("Assessment deleted.");
            closeModal();
          } catch (error: unknown) {
            mutationToast.error(
              getErrorMessage(error, "Failed to delete assessment."),
            );
          }
        }}
      />,
    );
  };

  if (isArchived || !canManageAssessments) return null;

  const menu =
    open && menuPos
      ? createPortal(
          <div
            ref={menuRef}
            className="fixed z-[200] w-[160px] -translate-y-full rounded-[12px] border border-[#E8EDF5] bg-white py-1 shadow-lg"
            style={{ top: menuPos.top, right: menuPos.right }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleEdit();
              }}
              className="w-full px-4 py-2.5 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB]"
            >
              Edit
            </button>
            {isDraft ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  void handlePublish();
                }}
                disabled={publish.isPending}
                className="w-full px-4 py-2.5 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB] disabled:opacity-50"
              >
                Publish
              </button>
            ) : null}
            {isPublished ? (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  void handleUnpublish();
                }}
                disabled={draft.isPending}
                className="w-full px-4 py-2.5 text-left text-[14px] text-[#1D1D1D] hover:bg-[#F7F9FB] disabled:opacity-50"
              >
                Unpublish
              </button>
            ) : null}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                handleDelete();
              }}
              disabled={archive.isPending}
              className="w-full px-4 py-2.5 text-left text-[14px] text-[#EF4444] hover:bg-[#FEF2F2] disabled:opacity-50"
            >
              Delete
            </button>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="relative z-10 text-[13px] text-[#4E845F] hover:opacity-80"
        aria-label="Assessment actions"
        aria-expanded={open}
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>
      {menu}
    </div>
  );
}

export function AssignmentTable({
  students,
  programId,
  pagination,
  search,
  setSearch,
  status,
  setStatus,
  setPage,
  isLoading = false,
  canManageAssessments = true,
}: StudentsTableProps) {
  const router = useRouter();

  const columns = useMemo<ColumnDef<StaffAssignment, unknown>[]>(
    () => [
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <StatusBadge status={String(row.original.status ?? "")} />
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.title}</span>
        ),
      },
      {
        accessorKey: "module",
        header: "Course",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.module}</span>
        ),
      },
      {
        accessorKey: "submissions",
        header: "Submissions",
        cell: ({ row }) => (
          <span className="text-sm">
            {row.original.submissions?.submitted ?? 0} /{" "}
            {row.original.submissions?.total ?? 0}
          </span>
        ),
      },
      {
        accessorKey: "weight",
        header: "Weight",
        cell: ({ row }) => (
          <span className="text-sm">{row.original.weight}%</span>
        ),
      },
      {
        accessorKey: "dueDate",
        header: "Due date",
        cell: ({ row }) => (
          <span className="text-sm">{formatDate(row.original.dueDate)}</span>
        ),
      },
      ...(canManageAssessments
        ? [
            {
              id: "actions",
              header: "",
              cell: ({ row }: { row: { original: StaffAssignment } }) => (
                <ActionDropdown
                  assessment={row.original}
                  programId={programId}
                  canManageAssessments={canManageAssessments}
                />
              ),
            } satisfies ColumnDef<StaffAssignment, unknown>,
          ]
        : []),
    ],
    [canManageAssessments, programId],
  );

  const rows = Array.isArray(students) ? students : [];

  return (
    <div className="space-y-2">
      {isLoading && rows.length === 0 ? (
        <p className="text-[14px] text-[#94A3B8]">Loading assessments…</p>
      ) : null}
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row, index) => row._id || String(index)}
        pagination={pagination}
        searchValue={search}
        onSearchChange={setSearch}
        statusFilter={status}
        onStatusFilterChange={(value) => {
          const next = value.trim().toLowerCase();
          if (!next || next === "all" || next.startsWith("all status")) {
            setStatus("");
            return;
          }
          setStatus(next === "archive" ? "archived" : next);
        }}
        onPageChange={setPage}
        onRowClick={(row) => router.push(`/assessment/${row._id}`)}
        searchable
        statusOptions={["All statuses", "published", "draft", "archived"]}
      />
      {!isLoading && rows.length === 0 ? (
        <p className="pt-2 text-center text-[14px] text-[#94A3B8]">
          No assessments found for this course.
        </p>
      ) : null}
    </div>
  );
}

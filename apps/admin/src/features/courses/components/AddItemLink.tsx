"use client";

import { Plus } from "lucide-react";

interface AddItemLinkProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function AddItemLink({ label, onClick, disabled }: AddItemLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#4C7D5B] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Plus className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}

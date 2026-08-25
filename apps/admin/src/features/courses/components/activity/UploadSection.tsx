"use client";

import { useState } from "react";
import { Input } from "@ssu/ui";
import { cn } from "@ssu/utils";
import { FileText, Link2, UploadCloud } from "lucide-react";
import type { UploadSourceMode } from "../../types/activity";
import { activityFieldClassName } from "./activity-form-styles";

interface UploadSectionProps {
  title: string;
}

export function UploadSection({ title }: UploadSectionProps) {
  const [mode, setMode] = useState<UploadSourceMode>("device");
  const [url, setUrl] = useState("");

  return (
    <div className="space-y-3">
      <p className="text-[14px] font-semibold text-[#1D1D1D]">{title}</p>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: "device" as const, label: "From Device", icon: FileText },
            { value: "url" as const, label: "From URL", icon: Link2 },
          ] as const
        ).map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-medium transition",
              mode === value
                ? "border-[#4C7D5B] bg-[#E8F3EC] text-[#4C7D5B]"
                : "border-[#D7DFEA] bg-white text-[#64748B]",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {mode === "device" ? (
        <label className="flex min-h-[132px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-[#D7DFEA] bg-[#FAFBFC] px-4 py-6 text-center">
          <UploadCloud className="h-5 w-5 text-[#64748B]" />
          <span className="text-[14px] text-[#64748B]">
            Drop file here or{" "}
            <span className="font-semibold text-[#4C7D5B]">
              click to browse
            </span>
          </span>
          <span className="text-[13px] text-[#94A3B8]">
            You can upload files up to the maximum of 100 MB
          </span>
          <input type="file" className="hidden" />
        </label>
      ) : (
        <Input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Paste file URL"
          className={activityFieldClassName}
        />
      )}
    </div>
  );
}

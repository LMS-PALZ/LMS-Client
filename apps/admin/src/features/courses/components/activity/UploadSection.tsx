"use client";

import { useState } from "react";
import { Input } from "@ssu/ui";
import { Link2, X } from "lucide-react";
import type { ActivityResourceDraft } from "../../types/activity";
import { isHttpUrl } from "../../lib/course-utils";
import { activityFieldClassName } from "./activity-form-styles";

interface RecordingUrlFieldProps {
  url: string;
  onUrlChange: (value: string) => void;
  error?: string;
}

export function RecordingUrlField({
  url,
  onUrlChange,
  error,
}: RecordingUrlFieldProps) {
  return (
    <div className="space-y-3">
      <p className="text-[14px] font-semibold text-[#1D1D1D]">Add Recordings</p>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#4C7D5B] bg-[#E8F3EC] px-4 py-1.5 text-[13px] font-medium text-[#4C7D5B]">
        <Link2 className="h-4 w-4" />
        From URL
      </div>
      <Input
        value={url}
        onChange={(event) => onUrlChange(event.target.value)}
        placeholder="Paste recording URL"
        className={activityFieldClassName}
      />
      {error ? <p className="text-[13px] text-[#C62828]">{error}</p> : null}
    </div>
  );
}

interface ResourceLinksFieldProps {
  resources: ActivityResourceDraft[];
  onResourcesChange: (value: ActivityResourceDraft[]) => void;
}

export function ResourceLinksField({
  resources,
  onResourcesChange,
}: ResourceLinksFieldProps) {
  const [draftUrl, setDraftUrl] = useState("");
  const [error, setError] = useState("");

  const addResource = () => {
    const url = draftUrl.trim();
    if (!url) return;
    if (!isHttpUrl(url)) {
      setError("Enter a valid http or https URL.");
      return;
    }
    onResourcesChange([
      ...resources,
      {
        id: `temp-resource-${crypto.randomUUID()}`,
        title: url,
        url,
        type: "link",
      },
    ]);
    setDraftUrl("");
    setError("");
  };

  return (
    <div className="space-y-3">
      <p className="text-[14px] font-semibold text-[#1D1D1D]">Add Resources</p>
      <div className="inline-flex items-center gap-2 rounded-full border border-[#4C7D5B] bg-[#E8F3EC] px-4 py-1.5 text-[13px] font-medium text-[#4C7D5B]">
        <Link2 className="h-4 w-4" />
        From URL
      </div>

      {resources.length > 0 ? (
        <ul className="space-y-2">
          {resources.map((resource, index) => (
            <li
              key={resource.id || resource.url || String(index)}
              className="flex items-center justify-between gap-3 rounded-lg border border-[#D7DFEA] bg-white px-3 py-2"
            >
              <span className="truncate text-[13px] text-[#1D1D1D]">
                {resource.url}
              </span>
              <button
                type="button"
                aria-label="Remove resource"
                onClick={() =>
                  onResourcesChange(
                    resources.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="text-[#64748B] transition hover:text-[#C62828]"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={draftUrl}
          onChange={(event) => {
            setDraftUrl(event.target.value);
            if (error) setError("");
          }}
          placeholder="Paste resource URL"
          className={activityFieldClassName}
        />
        <button
          type="button"
          onClick={addResource}
          className="h-11 shrink-0 rounded-lg bg-[#4C7D5B] px-4 text-[14px] font-medium text-white hover:bg-[#3d6549]"
        >
          Add
        </button>
      </div>
      {error ? <p className="text-[13px] text-[#C62828]">{error}</p> : null}
    </div>
  );
}

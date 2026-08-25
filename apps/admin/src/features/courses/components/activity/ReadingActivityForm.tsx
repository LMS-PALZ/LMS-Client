"use client";

import { useState } from "react";
import { FormField, Input } from "@ssu/ui";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  Strikethrough,
  Underline,
} from "lucide-react";
import type { ReadingActivityFormProps } from "../../types/activity";
import { activityFieldClassName } from "./activity-form-styles";

const TOOLBAR_ITEMS = [
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: Underline, label: "Underline" },
  { icon: Strikethrough, label: "Strikethrough" },
  { icon: AlignLeft, label: "Align left" },
  { icon: AlignCenter, label: "Align center" },
  { icon: AlignRight, label: "Align right" },
  { icon: List, label: "Bullet list" },
];

export function ReadingActivityForm({
  title,
  onTitleChange,
  content,
  onContentChange,
  titlePlaceholder = "Social Media Strategy: Viral Campaigns",
}: ReadingActivityFormProps) {
  const [fontSize, setFontSize] = useState("14");

  return (
    <>
      <FormField id="reading-title" label="Title">
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={titlePlaceholder}
          className={activityFieldClassName}
        />
      </FormField>

      <FormField id="reading-editor" label="Note Editor">
        <div className="overflow-hidden rounded-lg border border-[#D7DFEA]">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#EEF2F6] bg-[#FAFBFC] px-3 py-2.5">
            <select
              value={fontSize}
              onChange={(event) => setFontSize(event.target.value)}
              className="h-8 rounded-md border border-[#D7DFEA] bg-white px-2 text-[13px] text-[#1D1D1D]"
              aria-label="Font size"
            >
              {["12", "14", "16", "18", "20"].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            {TOOLBAR_ITEMS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#D7DFEA] bg-white text-[#475569]"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(event) => onContentChange(event.target.value)}
            style={{ fontSize: `${fontSize}px` }}
            rows={14}
            placeholder="Write the reading content here..."
            className="min-h-[320px] w-full resize-y px-4 py-4 text-[14px] text-[#1D1D1D] outline-none"
          />
        </div>
      </FormField>
    </>
  );
}

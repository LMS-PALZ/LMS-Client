"use client";

import { useState } from "react";
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

interface SessionReadingFieldProps {
  content: string;
  onContentChange: (value: string) => void;
}

/** Optional reading / notes block shown inside live and pre-recorded session forms. */
export function SessionReadingField({
  content,
  onContentChange,
}: SessionReadingFieldProps) {
  const [fontSize, setFontSize] = useState("14");

  return (
    <div className="space-y-2">
      <div>
        <p className="text-[14px] font-semibold text-[#1D1D1D]">Reading</p>
        <p className="mt-0.5 text-[12px] text-[#64748B]">
          Optional notes or reading material for this session.
        </p>
      </div>
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
          rows={8}
          placeholder="Write reading content for this session..."
          className="min-h-[160px] w-full resize-y px-4 py-4 text-[14px] text-[#1D1D1D] outline-none"
        />
      </div>
    </div>
  );
}

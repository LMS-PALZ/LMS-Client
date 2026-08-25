"use client";

import { cn } from "@ssu/utils";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
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
import { useCallback } from "react";

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded p-1.5 text-neutral-600 transition hover:bg-white hover:text-neutral-900"
      aria-label={label}
    >
      {children}
    </button>
  );
}

export function AssessmentCommentsEditor({
  value,
  onChange,
  disabled,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback(
    (command: string, commandValue?: string) => {
      document.execCommand(command, false, commandValue);
      editorRef.current?.focus();
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    },
    [onChange],
  );

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-[14px] font-bold text-neutral-900">Comments</label>
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-neutral-200 bg-white",
          disabled && "opacity-60",
        )}
      >
        <div
          className={cn(
            "flex flex-wrap items-center gap-0.5 border-b border-[#BFDBFE] bg-[#EFF6FF] px-2 py-1.5",
            disabled && "pointer-events-none",
          )}
        >
          <span className="mr-1 rounded border border-neutral-200 bg-white px-2 py-0.5 text-[12px] text-neutral-600">
            14
          </span>
          <ToolbarButton label="Bold" onClick={() => exec("bold")}>
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton label="Italic" onClick={() => exec("italic")}>
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton label="Underline" onClick={() => exec("underline")}>
            <Underline className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Strikethrough"
            onClick={() => exec("strikeThrough")}
          >
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <span className="mx-1 h-5 w-px bg-neutral-300" aria-hidden />
          <ToolbarButton label="Align left" onClick={() => exec("justifyLeft")}>
            <AlignLeft className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Align center"
            onClick={() => exec("justifyCenter")}
          >
            <AlignCenter className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Align right"
            onClick={() => exec("justifyRight")}
          >
            <AlignRight className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Bulleted list"
            onClick={() => exec("insertUnorderedList")}
          >
            <List className="h-4 w-4" />
          </ToolbarButton>
        </div>
        <div
          ref={editorRef}
          contentEditable={!disabled}
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          className={cn(
            "min-h-[140px] px-4 py-3 text-[14px] leading-7 text-neutral-700 outline-none",
            "empty:before:pointer-events-none empty:before:text-neutral-400 empty:before:content-[attr(data-placeholder)]",
          )}
        />
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { FormField, Input, DatePicker, TimePicker } from "@ssu/ui";
import { cn } from "@ssu/utils";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  FileText,
  Italic,
  Link2,
  List,
  Strikethrough,
  Underline,
  UploadCloud,
} from "lucide-react";

const fieldClassName = "h-11 rounded-lg border-[#D7DFEA] bg-white text-[14px]";

interface ReadingActivityFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  content: string;
  onContentChange: (value: string) => void;
  titlePlaceholder?: string;
}

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
          className={fieldClassName}
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

interface UploadSectionProps {
  title: string;
}

function UploadSection({ title }: UploadSectionProps) {
  const [mode, setMode] = useState<"device" | "url">("device");
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
          className={fieldClassName}
        />
      )}
    </div>
  );
}

interface LiveSessionActivityFormProps {
  title: string;
  onTitleChange: (value: string) => void;
  meetingLink: string;
  onMeetingLinkChange: (value: string) => void;
  sessionDate: Date | null;
  onSessionDateChange: (value: Date | null) => void;
  sessionTime: string | null;
  onSessionTimeChange: (value: string | null) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  recordingUrl: string;
  onRecordingUrlChange: (value: string) => void;
  titlePlaceholder?: string;
}

export function LiveSessionActivityForm({
  title,
  onTitleChange,
  meetingLink,
  onMeetingLinkChange,
  sessionDate,
  onSessionDateChange,
  sessionTime,
  onSessionTimeChange,
  description,
  onDescriptionChange,
  recordingUrl: _recordingUrl,
  onRecordingUrlChange: _onRecordingUrlChange,
  titlePlaceholder = "Social Media Strategy: Viral Campaigns",
}: LiveSessionActivityFormProps) {
  return (
    <>
      <FormField id="live-title" label="Title">
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={titlePlaceholder}
          className={fieldClassName}
        />
      </FormField>

      <FormField id="live-meeting-link" label="Live meeting link">
        <Input
          value={meetingLink}
          onChange={(event) => onMeetingLinkChange(event.target.value)}
          placeholder="Enter your meeting link"
          className={fieldClassName}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="live-date" label="Date">
          <DatePicker
            id="live-date"
            value={sessionDate}
            onChange={onSessionDateChange}
            buttonClassName={cn(fieldClassName, "h-11 rounded-lg px-3")}
          />
        </FormField>
        <FormField id="live-time" label="Time">
          <TimePicker
            id="live-time"
            value={sessionTime}
            onChange={onSessionTimeChange}
            buttonClassName={cn(fieldClassName, "h-11 rounded-lg px-3")}
          />
        </FormField>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="live-description"
          className="text-[14px] font-medium text-[#1D1D1D]"
        >
          Description<span className="text-[#C62828]">*</span>
        </label>
        <textarea
          id="live-description"
          value={description}
          onChange={(event) =>
            onDescriptionChange(event.target.value.slice(0, 140))
          }
          rows={4}
          placeholder="What will this module be about?"
          className="w-full rounded-lg border border-[#D7DFEA] px-4 py-3 text-[14px] text-[#1D1D1D] outline-none"
        />
        <p className="text-right text-[12px] text-[#94A3B8]">
          {description.length}/140
        </p>
      </div>

      <UploadSection title="Add Recordings" />
      <UploadSection title="Add Resources" />
    </>
  );
}

"use client";

import { useState } from "react";
import { FormField, Input } from "@ssu/ui";
import { cn } from "@ssu/utils";
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
          className="h-11 rounded-xl border-[#D7DFEA]"
        />
      </FormField>

      <FormField id="reading-editor" label="Note Editor">
        <div className="overflow-hidden rounded-[12px] border border-[#D7DFEA]">
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
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#D7DFEA] bg-white text-[#475569] transition hover:bg-[#F7F9FB]"
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
            className="min-h-[320px] w-full resize-y px-4 py-4 text-[#1D1D1D] outline-none"
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
      <div className="inline-flex rounded-full border border-[#D7DFEA] bg-[#F7F9FB] p-1">
        {(["device", "url"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-[13px] font-medium transition",
              mode === value
                ? "bg-white text-[#4C7D5B] shadow-sm"
                : "text-[#64748B]",
            )}
          >
            {value === "device" ? "From Device" : "From URL"}
          </button>
        ))}
      </div>

      {mode === "device" ? (
        <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed border-[#C5D6CB] bg-[#FAFBFC] px-4 py-6 text-center transition hover:bg-[#F4F8F5]">
          <span className="text-[14px] font-medium text-[#4C7D5B]">
            Drop file here or click to browse
          </span>
          <span className="mt-1 text-[13px] text-[#64748B]">
            You can upload files up to the maximum of 100 MB
          </span>
          <input type="file" className="hidden" />
        </label>
      ) : (
        <Input
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="Paste file URL"
          className="h-11 rounded-xl border-[#D7DFEA]"
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
  sessionDate: string;
  onSessionDateChange: (value: string) => void;
  sessionTime: string;
  onSessionTimeChange: (value: string) => void;
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
  recordingUrl,
  onRecordingUrlChange,
  titlePlaceholder = "Social Media Strategy: Viral Campaigns",
}: LiveSessionActivityFormProps) {
  return (
    <>
      <FormField id="live-title" label="Title">
        <Input
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder={titlePlaceholder}
          className="h-11 rounded-xl border-[#D7DFEA]"
        />
      </FormField>

      <FormField id="live-meeting-link" label="Live meeting link">
        <Input
          value={meetingLink}
          onChange={(event) => onMeetingLinkChange(event.target.value)}
          placeholder="Enter your meeting link"
          className="h-11 rounded-xl border-[#D7DFEA]"
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="live-date" label="Date">
          <Input
            value={sessionDate}
            onChange={(event) => onSessionDateChange(event.target.value)}
            placeholder="DD/MM/YYYY"
            className="h-11 rounded-xl border-[#D7DFEA]"
          />
        </FormField>
        <FormField id="live-time" label="Time">
          <Input
            value={sessionTime}
            onChange={(event) => onSessionTimeChange(event.target.value)}
            placeholder="HH:MM"
            className="h-11 rounded-xl border-[#D7DFEA]"
          />
        </FormField>
      </div>

      <FormField id="live-description" label="Description*">
        <div className="relative">
          <textarea
            value={description}
            onChange={(event) =>
              onDescriptionChange(event.target.value.slice(0, 140))
            }
            rows={4}
            placeholder="What will this module be about?"
            className="w-full rounded-xl border border-[#D7DFEA] px-4 py-3 text-[14px] text-[#1D1D1D] outline-none"
          />
          <span className="absolute bottom-3 right-3 text-[12px] text-[#94A3B8]">
            {description.length}/140
          </span>
        </div>
      </FormField>

      <UploadSection title="Add Recordings" />
      <div className="hidden">
        <Input
          value={recordingUrl}
          onChange={(event) => onRecordingUrlChange(event.target.value)}
        />
      </div>
      <UploadSection title="Add Resources" />
    </>
  );
}

"use client";

import { DatePicker, FormField, Input, TimePicker } from "@ssu/ui";
import { cn } from "@ssu/utils";
import type { LiveSessionActivityFormProps } from "../../types/activity";
import { activityFieldClassName } from "./activity-form-styles";
import { UploadSection } from "./UploadSection";

export function LiveSessionActivityForm({
  title,
  onTitleChange,
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
          className={activityFieldClassName}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="live-date" label="Date">
          <DatePicker
            id="live-date"
            value={sessionDate}
            onChange={onSessionDateChange}
            buttonClassName={cn(activityFieldClassName, "h-11 rounded-lg px-3")}
          />
        </FormField>
        <FormField id="live-time" label="Time">
          <TimePicker
            id="live-time"
            value={sessionTime}
            onChange={onSessionTimeChange}
            buttonClassName={cn(activityFieldClassName, "h-11 rounded-lg px-3")}
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

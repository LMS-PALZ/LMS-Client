"use client";

import {} from "@ssu/queries";
import { EMPTY_SUBMISSION, useAssessmentSubmissionStore } from "@ssu/store";
import { cn, formatFileSize } from "@ssu/utils";
import { CloudUpload, FileText, Link2, Paperclip, Plus, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { AssessmentDetailContent } from "@/lib/assessments";
import { AssessmentCommentsEditor } from "./AssessmentCommentsEditor";
import {
  useSubmitAssessmentMutation,
  useUndoSubmissionMutation,
} from "@ssu/queries";
import { notify } from "@ssu/ui";

type AttachmentTab = "device" | "url";

const MAX_FILE_BYTES = 100 * 1024 * 1024;

function simulateUpload(
  assignmentId: string,
  onComplete: () => void,
): () => void {
  const store = useAssessmentSubmissionStore.getState();
  let progress = 0;
  store.setUploadProgress(assignmentId, 0);

  const interval = window.setInterval(() => {
    progress += 12 + Math.random() * 15;
    if (progress >= 100) {
      store.setUploadProgress(assignmentId, 100);
      window.clearInterval(interval);
      window.setTimeout(() => {
        store.setUploadProgress(assignmentId, null);
        onComplete();
      }, 350);
      return;
    }
    store.setUploadProgress(assignmentId, Math.min(Math.round(progress), 99));
  }, 180);

  return () => window.clearInterval(interval);
}

export function AssessmentMyWork({
  assignmentId,
  submissionRequirements,
  readOnly = false,
}: {
  assignmentId: string;
  submissionRequirements: AssessmentDetailContent["submissionRequirements"];
  readOnly?: boolean;
}) {
  const submitMutation = useSubmitAssessmentMutation(assignmentId);
  const undoMutation = useUndoSubmissionMutation(assignmentId);

  const [tab, setTab] = useState<AttachmentTab>("device");
  const [urlDraft, setUrlDraft] = useState("https://");
  const cancelUploadRef = useRef<(() => void) | null>(null);
  const uploadedFilesRef = useRef<Record<string, File | null>>({});

  const submission = useAssessmentSubmissionStore(
    (s) => s.byAssignment[assignmentId] ?? EMPTY_SUBMISSION,
  );
  const uploadProgress = useAssessmentSubmissionStore(
    (s) => s.uploadProgress[assignmentId] ?? null,
  );
  const setComments = useAssessmentSubmissionStore((s) => s.setComments);
  const addAttachment = useAssessmentSubmissionStore((s) => s.addAttachment);
  const removeAttachment = useAssessmentSubmissionStore(
    (s) => s.removeAttachment,
  );
  const submitAssignment = useAssessmentSubmissionStore(
    (s) => s.submitAssignment,
  );
  const undoSubmission = useAssessmentSubmissionStore((s) => s.undoSubmission);

  const isUploading = uploadProgress !== null;
  const files = submission.attachments.filter((a) => a.kind === "file");
  const links = submission.attachments.filter((a) => a.kind === "url");

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0];
      if (!file || readOnly || isUploading) return;

      if (file.size > MAX_FILE_BYTES) {
        notify.error("File is too large", "Maximum upload size is 100 MB.");
        return;
      }

      uploadedFilesRef.current[assignmentId] = file;
      cancelUploadRef.current?.();
      cancelUploadRef.current = simulateUpload(assignmentId, () => {
        addAttachment(assignmentId, {
          id: `file-${Date.now()}`,
          kind: "file",
          name: file.name,
          sizeBytes: file.size,
        });
        notify.success("File uploaded", `${file.name} was added to your work.`);
      });
    },
    [assignmentId, addAttachment, isUploading, readOnly],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_BYTES,
    multiple: false,
    disabled: readOnly || isUploading || submitMutation.isPending,
    noClick: true,
    noKeyboard: true,
  });

  const handleAddUrl = () => {
    const trimmed = urlDraft.trim();
    if (!trimmed || trimmed === "https://") {
      notify.error("Enter a valid URL");
      return;
    }
    try {
      const parsed = new URL(
        trimmed.startsWith("http") ? trimmed : `https://${trimmed}`,
      );
      addAttachment(assignmentId, {
        id: `url-${Date.now()}`,
        kind: "url",
        name: parsed.hostname,
        url: parsed.toString(),
      });
      setUrlDraft("https://");
      notify.success("Link added", "Your URL was attached to this assignment.");
    } catch {
      notify.error("Enter a valid URL");
    }
  };

  const handleSubmit = async () => {
    const fileAttachment = submission.attachments.find(
      (a) => a.kind === "file",
    );
    const urlAttachment = submission.attachments.find((a) => a.kind === "url");

    if (!fileAttachment && !urlAttachment) {
      notify.error(
        "Add your work first",
        "Upload a file or add a link before submitting.",
      );
      return;
    }

    try {
      const res = await submitMutation.mutateAsync({
        submissionType: fileAttachment ? "file" : "link",
        file: fileAttachment
          ? (uploadedFilesRef.current[assignmentId] ?? undefined)
          : undefined,
        submissionLink: urlAttachment?.url,
        comment: submission.comments || undefined,
      });
      // console.log("submit res:", res);

      const submissionId = res?._id;
      console.log(
        "Submission successful for assignmentId:",
        assignmentId,
        "submissionId:",
        submissionId,
      );
      submitAssignment(assignmentId, submissionId);
      notify.success("Assignment submitted successfully!");
    } catch (error: any) {
      notify.error("Submission failed", error?.message);
    }
  };

  const handleUndo = async () => {
    const Id = submission.submissionId;
    console.log(
      "Undo submission for assignmentId:",
      assignmentId,
      "submissionId:",
      Id,
    );

    if (!Id) {
      notify.error("Cannot undo", "Submission ID not found.");
      return;
    }

    try {
      await undoMutation.mutateAsync(Id);
      undoSubmission(assignmentId);
      notify.info("Submission undone", "You can edit and resubmit your work.");
    } catch (error: any) {
      notify.error("Failed to undo", error?.message);
    }
  };

  const formatSubmittedDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <section className="rounded-2xl border border-neutral-200/80 bg-[#F8FAFC] p-4 sm:p-6">
      <h2 className="text-[15px] font-bold text-neutral-900 sm:text-[16px]">
        My Work
      </h2>

      {readOnly ? (
        <div className="mt-5 space-y-3">
          {submission.attachments.length === 0 ? (
            <p className="text-[14px] text-neutral-500">No attachments.</p>
          ) : (
            submission.attachments.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
              >
                {item.kind === "url" ? (
                  <Link2 className="h-4 w-4 shrink-0 text-neutral-500" />
                ) : (
                  <FileText className="h-4 w-4 shrink-0 text-neutral-500" />
                )}
                <span className="min-w-0 flex-1 truncate text-[14px] text-neutral-800">
                  {item.kind === "url" ? item.url : item.name}
                </span>
              </div>
            ))
          )}
          {submission.comments ? (
            <div
              className="rounded-xl border border-neutral-200 bg-white p-4 text-[14px] leading-7 text-neutral-600 prose-p:my-1"
              dangerouslySetInnerHTML={{ __html: submission.comments }}
            />
          ) : null}
          <ul className="list-disc space-y-1 pl-5 text-[13px] text-neutral-500">
            {submissionRequirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={handleUndo}
              className="rounded-full bg-[#D4EDDA] px-5 py-2.5 text-[14px] font-semibold text-[#2D6A4F] transition hover:bg-[#BBF7D0]"
            >
              Undo Submission
            </button>
            {submission.submittedAt ? (
              <p className="text-[13px] text-neutral-500">
                Submitted on {formatSubmittedDate(submission.submittedAt)}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-5">
          <div>
            <p className="mb-2 text-[13px] font-semibold text-neutral-800">
              Add Attachment
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setTab("device")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold transition",
                  tab === "device"
                    ? "border-[#4E845F] bg-white text-[#4E845F]"
                    : "border-transparent bg-white/60 text-neutral-600 hover:bg-white",
                )}
              >
                <Paperclip className="h-4 w-4" />
                From Device
              </button>
              <button
                type="button"
                onClick={() => setTab("url")}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold transition",
                  tab === "url"
                    ? "border-[#4E845F] bg-white text-[#4E845F]"
                    : "border-transparent bg-white/60 text-neutral-600 hover:bg-white",
                )}
              >
                <Link2 className="h-4 w-4" />
                From URL
              </button>
            </div>
          </div>

          {tab === "device" ? (
            <div className="space-y-3">
              {isUploading ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white px-6 py-10 text-center">
                  <CloudUpload
                    className="mx-auto mb-3 h-8 w-8 text-neutral-400"
                    aria-hidden
                  />
                  <p className="text-[14px] font-semibold text-neutral-800">
                    Uploading
                  </p>
                  <div className="mx-auto mt-4 h-2 max-w-xs overflow-hidden rounded-full bg-[#E8ECF0]">
                    <div
                      className="h-full rounded-full bg-[#4E845F] transition-all duration-200"
                      style={{ width: `${uploadProgress ?? 0}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  {...getRootProps()}
                  className={cn(
                    "rounded-xl border-2 border-dashed border-neutral-300 bg-white px-6 py-10 text-center transition-colors",
                    isDragActive && "border-[#4E845F] bg-[#F0FDF4]",
                  )}
                >
                  <input {...getInputProps()} />
                  <CloudUpload
                    className="mx-auto mb-3 h-8 w-8 text-neutral-400"
                    aria-hidden
                  />
                  <p className="text-[14px] text-neutral-600">
                    Drop file here or{" "}
                    <button
                      type="button"
                      onClick={open}
                      className="font-semibold text-[#4E845F] underline-offset-2 hover:underline"
                    >
                      click to browse
                    </button>
                  </p>
                  <p className="mt-2 text-[12px] text-neutral-500">
                    You can upload files up to the maximum of 100 MB
                  </p>
                </div>
              )}

              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
                >
                  <FileText className="h-4 w-4 shrink-0 text-neutral-500" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-medium text-neutral-800">
                      {file.name}
                    </p>
                    {file.sizeBytes != null ? (
                      <p className="text-[12px] text-neutral-500">
                        {formatFileSize(file.sizeBytes)}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(assignmentId, file.id)}
                    className="rounded-md p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <input
                    type="url"
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    placeholder="https://"
                    className="min-w-0 flex-1 rounded-lg border border-neutral-200 px-3 py-2.5 text-[14px] text-neutral-800 outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrl}
                    className="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-[#4E845F] px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-[#3d6a4c]"
                  >
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {links.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
                >
                  <Link2 className="h-4 w-4 shrink-0 text-neutral-500" />
                  <span className="min-w-0 flex-1 truncate text-[14px] text-neutral-800">
                    {link.url}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(assignmentId, link.id)}
                    className="rounded-md p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-800"
                    aria-label="Remove link"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <AssessmentCommentsEditor
            value={submission.comments}
            onChange={(html) => setComments(assignmentId, html)}
            placeholder="Add comments for your instructor (optional)"
          />

          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
            className="rounded-full bg-[#2D6A4F] px-8 py-2.5 text-[14px] font-semibold text-white shadow-sm transition hover:bg-[#245a43] disabled:opacity-50"
          >
            {submitMutation.isPending ? "Submitting..." : "Submit"}
          </button>
        </div>
      )}
    </section>
  );
}

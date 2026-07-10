"use client";

import { useState } from "react";
import { Button, Input, AlertBanner, Spinner } from "@ssu/ui";
import { ExternalLink, Link2, FileText } from "lucide-react";
import { useGradeSubmissionMutation } from "@ssu/queries";

interface Props {
  assessmentId: string;
  submissionId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;
  status: string;
  score: number | null;
  feedback: string | null;
  comment: string | null;
  weight: number;
  file?: {
    url: string;
    originalName: string;
    fileType: string;
    fileSizeMb: number;
  };
  submissionLink?: string | null;
  onClose: () => void;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function GradeSubmissionForm({
  assessmentId,
  submissionId,
  studentId,
  studentName,
  submittedAt,
  status,
  score: initialScore,
  feedback: initialFeedback,
  comment,
  weight,
  file,
  submissionLink,
  onClose,
}: Props) {
  const gradeMutation = useGradeSubmissionMutation(assessmentId);
  const [score, setScore] = useState(initialScore?.toString() ?? "");
  const [feedback, setFeedback] = useState(initialFeedback ?? "");

  const handleSubmit = async () => {
    if (!score) return;

    try {
      await gradeMutation.mutateAsync({
        submissionId,
        studentId,
        score: Number(score),
        feedback: feedback || undefined,
      });
      onClose();
    } catch {}
  };

  return (
    <div className="space-y-6">
      {gradeMutation.isError && (
        <AlertBanner variant="error">
          {(gradeMutation.error as Error)?.message}
        </AlertBanner>
      )}

      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-300 text-[14px] font-semibold text-white">
          {studentName
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </span>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[16px] font-semibold text-[#1D1D1D]">
              {studentName}
            </p>
            <span
              className={`rounded-full px-3 py-0.5 text-[12px] font-medium ${
                status === "graded"
                  ? "bg-[#DFF6E3] text-[#2F855A]"
                  : "bg-[#E0F2FE] text-[#2563EB]"
              }`}
            >
              {status}
            </span>
          </div>
          <p className="text-[13px] text-[#6B7280]">
            Submitted on {formatDate(submittedAt)}
          </p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-[14px] font-semibold text-[#1D1D1D]">
          Attached file
        </h3>

        {file && (
          <div className="flex items-center justify-between rounded-[12px] border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#F8FAFC]">
                <FileText className="h-5 w-5 text-[#6B7280]" />
              </div>
              <div>
                <p className="text-[13px] font-medium text-[#1D1D1D]">
                  {file.originalName}
                </p>
                <p className="text-[12px] text-[#9CA3AF]">
                  {file.fileSizeMb} MB · {file.fileType.toUpperCase()}
                </p>
              </div>
            </div>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[13px] font-medium text-[#4E845F] hover:opacity-80"
            >
              Open
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}

        {submissionLink && (
          <div className="flex items-center justify-between rounded-[12px] border border-[#E2E8F0] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#F8FAFC]">
                <Link2 className="h-5 w-5 text-[#6B7280]" />
              </div>
              <p className="text-[13px] text-[#1D1D1D]">{submissionLink}</p>
            </div>
            <a
              href={submissionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[13px] font-medium text-[#4E845F] hover:opacity-80"
            >
              Open
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </div>

      {comment && (
        <div>
          <h3 className="mb-2 text-[14px] font-semibold text-[#1D1D1D]">
            Student's comment
          </h3>
          <div className="rounded-[12px] border border-[#CBD5E1] bg-[#F8FAFC] p-4 text-[14px] leading-6 text-[#475569]">
            {comment}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-[14px] font-semibold text-[#1D1D1D]">
          Score
        </label>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min="0"
            max={weight}
            placeholder="0"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-[100px] text-center"
          />
          <span className="text-[18px] font-medium text-[#1D1D1D]">
            / {weight}
          </span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[14px] font-semibold text-[#1D1D1D]">
          Feedback
        </label>
        <textarea
          rows={4}
          placeholder="Add feedback for the student..."
          className="w-full resize-none rounded-[12px] border border-[#D7DFEC] p-3 text-[14px] outline-none focus:border-[#4E845F]"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          onClick={onClose}
          className="rounded-[30px]"
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={handleSubmit}
          disabled={gradeMutation.isPending || !score}
          className="rounded-[30px] text-[var(--color-surface)]"
        >
          {gradeMutation.isPending ? (
            <Spinner className="h-5 w-5 animate-spin" />
          ) : (
            "Grade and Return"
          )}
        </Button>
      </div>
    </div>
  );
}

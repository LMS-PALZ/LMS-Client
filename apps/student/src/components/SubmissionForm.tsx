"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { submissionLinkSchema, submissionTextSchema } from "@ssu/schema";
import { submissionsApi } from "@ssu/api";
import {
  AlertBanner,
  Button,
  FileDropzone,
  FormField,
  Input,
  Textarea,
} from "@ssu/ui";
import { useProfileSetup } from "@/contexts/ProfileSetupContext";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type Tab = "file" | "link" | "text";

export function SubmissionForm({
  assignmentId,
  disabled,
}: {
  assignmentId: string;
  disabled?: boolean;
}) {
  const { ensureProfileForAction } = useProfileSetup();
  const [tab, setTab] = useState<Tab>("file");
  const [file, setFile] = useState<File | null>(null);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkForm = useForm<z.infer<typeof submissionLinkSchema>>({
    resolver: zodResolver(submissionLinkSchema),
    defaultValues: { url: "" },
  });

  const textForm = useForm<z.infer<typeof submissionTextSchema>>({
    resolver: zodResolver(submissionTextSchema),
    defaultValues: { text: "" },
  });

  const submitFile = async () => {
    if (!ensureProfileForAction()) return;
    setError(null);
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    await submissionsApi.submit({ assignmentId, kind: "file", value: file });
    setDone(true);
  };

  const onLink = linkForm.handleSubmit(async (values) => {
    if (!ensureProfileForAction()) return;
    setError(null);
    await submissionsApi.submit({
      assignmentId,
      kind: "link",
      value: values.url,
    });
    setDone(true);
  });

  const onText = textForm.handleSubmit(async (values) => {
    if (!ensureProfileForAction()) return;
    setError(null);
    await submissionsApi.submit({
      assignmentId,
      kind: "text",
      value: values.text,
    });
    setDone(true);
  });

  if (done) {
    return <AlertBanner variant="success">Submission received.</AlertBanner>;
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-card space-y-4">
      <div className="flex gap-2">
        {(["file", "link", "text"] as const).map((t) => (
          <Button
            key={t}
            type="button"
            variant={tab === t ? "primary" : "secondary"}
            size="sm"
            onClick={() => setTab(t)}
            disabled={disabled}
          >
            {t === "file" ? "File" : t === "link" ? "Link" : "Text"}
          </Button>
        ))}
      </div>
      {error && <AlertBanner variant="error">{error}</AlertBanner>}
      {tab === "file" && (
        <div>
          <FileDropzone
            maxSizeBytes={10 * 1024 * 1024}
            description="Up to 10MB."
            onFiles={(files) => setFile(files[0] ?? null)}
          />
          <Button
            className="mt-4"
            disabled={disabled}
            onClick={() => void submitFile()}
          >
            Submit file
          </Button>
        </div>
      )}
      {tab === "link" && (
        <form onSubmit={onLink} className="space-y-3">
          <FormField
            id="url"
            label="URL"
            error={linkForm.formState.errors.url?.message}
          >
            <Input id="url" disabled={disabled} {...linkForm.register("url")} />
          </FormField>
          <Button type="submit" disabled={disabled}>
            Submit link
          </Button>
        </form>
      )}
      {tab === "text" && (
        <form onSubmit={onText} className="space-y-3">
          <FormField
            id="text"
            label="Response"
            error={textForm.formState.errors.text?.message}
          >
            <Textarea
              id="text"
              disabled={disabled}
              rows={8}
              {...textForm.register("text")}
            />
          </FormField>
          <p className="text-micro text-neutral-500">
            {textForm.watch("text")?.length ?? 0} / 10000
          </p>
          <Button type="submit" disabled={disabled}>
            Submit text
          </Button>
        </form>
      )}
    </div>
  );
}

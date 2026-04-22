"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { gradeSubmissionSchema } from "@ssu/schema";
import { Button, FormField, Input, Modal, Textarea } from "@ssu/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export function GradeForm() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof gradeSubmissionSchema>>({
    resolver: zodResolver(gradeSubmissionSchema),
  });

  const onSave = handleSubmit(() => {
    setOpen(false);
    reset();
  });

  return (
    <div className="rounded-xl border bg-white p-4 shadow-card space-y-4">
      <p className="text-body text-neutral-700">Submission preview (demo).</p>
      <Button type="button" variant="primary" onClick={() => setOpen(true)}>
        Open grading panel
      </Button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Grade submission"
        footer={
          <>
            <Button
              variant="amber"
              type="button"
              onClick={() => setOpen(false)}
            >
              Return for revision
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={() => void onSave()}
            >
              Save grade
            </Button>
          </>
        }
      >
        <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
          <FormField
            id="score"
            label="Score (0–100)"
            error={errors.score?.message}
          >
            <Input id="score" type="number" {...register("score")} />
          </FormField>
          <FormField
            id="feedback"
            label="Feedback"
            error={errors.feedback?.message}
          >
            <Textarea id="feedback" rows={4} {...register("feedback")} />
          </FormField>
        </form>
      </Modal>
    </div>
  );
}

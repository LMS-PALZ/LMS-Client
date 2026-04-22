import { courseDetailsStepSchema } from "@ssu/schema";
import { FormField, Input, Textarea } from "@ssu/ui";
import type { ReactNode } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";

type Values = z.infer<typeof courseDetailsStepSchema>;

export interface StepDetailsProps {
  form: UseFormReturn<Values>;
  bannerSlot: ReactNode;
  previewUrl: string | null;
}

export function StepDetails({
  form,
  bannerSlot,
  previewUrl,
}: StepDetailsProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-4">
      <FormField id="title" label="Title" error={errors.title?.message}>
        <Input id="title" {...register("title")} />
      </FormField>
      <FormField
        id="description"
        label="Description"
        error={errors.description?.message}
      >
        <Textarea id="description" rows={5} {...register("description")} />
      </FormField>
      <FormField
        id="category"
        label="Category"
        error={errors.category?.message}
      >
        <Input id="category" {...register("category")} />
      </FormField>
      <FormField
        id="durationHours"
        label="Duration (hours)"
        error={errors.durationHours?.message}
      >
        <Input
          id="durationHours"
          type="number"
          min={0}
          step={1}
          {...register("durationHours")}
        />
      </FormField>
      <div>
        <p className="text-small font-medium text-neutral-700 mb-2">
          Banner image
        </p>
        {bannerSlot}
        {previewUrl && (
          <img
            src={previewUrl}
            alt=""
            className="mt-3 max-h-40 w-full rounded-lg object-cover border"
          />
        )}
      </div>
    </div>
  );
}

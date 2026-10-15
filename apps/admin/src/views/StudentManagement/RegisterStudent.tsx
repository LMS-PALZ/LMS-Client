"use client";

import { CustomSelect, Input, FormField, Button } from "@ssu/ui";
import { getErrorMessage, useRegisterStudentMutation } from "@ssu/queries";
import {
  adminRegisterStudentSchema,
  type AdminRegisterStudentFormValues,
} from "@ssu/schema";
import type { AdminProgram } from "@ssu/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

type FormOutput = z.output<typeof adminRegisterStudentSchema>;

interface RegisterStudentProps {
  programs: AdminProgram[];
  defaultValues?: Partial<AdminRegisterStudentFormValues>;
  onClose: () => void;
  onSuccess: (values: FormOutput, programTitle: string) => void;
  onError: (message: string, values: AdminRegisterStudentFormValues) => void;
}

function programLabel(program: AdminProgram, duplicateTitle: boolean) {
  const cohort = program.cohortName?.trim();
  return duplicateTitle && cohort
    ? `${program.title} (${cohort})`
    : program.title;
}

export function RegisterStudent({
  programs,
  defaultValues,
  onClose,
  onSuccess,
  onError,
}: RegisterStudentProps) {
  const registerStudent = useRegisterStudentMutation();

  const programOptions = useMemo(() => {
    const titleCounts = new Map<string, number>();
    for (const program of programs) {
      titleCounts.set(program.title, (titleCounts.get(program.title) ?? 0) + 1);
    }
    return programs.map((program) => ({
      id: program.id,
      label: programLabel(program, (titleCounts.get(program.title) ?? 0) > 1),
    }));
  }, [programs]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AdminRegisterStudentFormValues, unknown, FormOutput>({
    resolver: zodResolver(adminRegisterStudentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      programId: "",
      ...defaultValues,
    },
  });

  const programId = useWatch({ control, name: "programId" });
  const selectedLabel =
    programOptions.find((option) => option.id === programId)?.label ?? "";
  const isBusy = isSubmitting || registerStudent.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerStudent.mutateAsync(values);
      onSuccess(values, selectedLabel);
    } catch (error) {
      onError(
        getErrorMessage(error, "Failed to register student."),
        getValues(),
      );
    }
  });

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="first_name"
          label="First name"
          error={errors.first_name?.message}
          className="text-sm"
        >
          <Input
            id="first_name"
            type="text"
            autoComplete="off"
            disabled={isBusy}
            {...register("first_name")}
            placeholder="Enter first name"
            className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
          />
        </FormField>

        <FormField
          id="last_name"
          label="Last name"
          error={errors.last_name?.message}
          className="text-sm"
        >
          <Input
            id="last_name"
            type="text"
            autoComplete="off"
            disabled={isBusy}
            {...register("last_name")}
            placeholder="Enter last name"
            className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
          />
        </FormField>
      </div>

      <FormField
        id="email"
        label="Email"
        error={errors.email?.message}
        className="text-sm"
      >
        <Input
          id="email"
          type="email"
          autoComplete="off"
          disabled={isBusy}
          {...register("email")}
          placeholder="Enter student's email address"
          className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
        />
      </FormField>

      <FormField
        id="phone_number"
        label="Phone number"
        error={errors.phone_number?.message}
        className="text-sm"
      >
        <Input
          id="phone_number"
          type="tel"
          inputMode="numeric"
          autoComplete="off"
          disabled={isBusy}
          {...register("phone_number")}
          placeholder="e.g. 08012345678"
          className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
        />
      </FormField>

      <FormField
        id="programId"
        label="Program"
        error={errors.programId?.message}
        className="text-sm"
      >
        <CustomSelect
          placeholder={
            programOptions.length ? "Select program" : "No published programs"
          }
          options={programOptions.map((option) => option.label)}
          value={selectedLabel}
          onChange={(label) => {
            const option = programOptions.find((item) => item.label === label);
            setValue("programId", option?.id ?? "", { shouldValidate: true });
          }}
        />
      </FormField>

      <p className="text-[12px] leading-5 text-[#6B7280]">
        The student will receive an email with a link to set their password and
        continue onboarding.
      </p>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onClose}
          disabled={isBusy}
          className="rounded-[30px] bg-[#E2E8F0] text-[#1D1D1D] hover:bg-[#D7DFEC]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isBusy}
          className="rounded-[30px] text-[var(--color-surface)]"
        >
          {isBusy ? "Registering..." : "Proceed Registration"}
        </Button>
      </div>
    </form>
  );
}

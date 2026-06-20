"use client";

import { CustomSelect, Input, FormField, Button, AlertBanner } from "@ssu/ui";
import { useInviteStaffMutation } from "@ssu/queries";
import { inviteStaffSchema } from "@ssu/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { useForm } from "react-hook-form";

type FormValues = z.infer<typeof inviteStaffSchema>;

interface InviteStaffProps {
  onClose: () => void;
  onSuccess: (email: string) => void;
}

export function InviteStaff({ onClose, onSuccess }: InviteStaffProps) {
  const inviteStaff = useInviteStaffMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(inviteStaffSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      role: "",
    },
  });

  const role = watch("role");

  const onSubmit = handleSubmit(async (values) => {
    try {
      await inviteStaff.mutateAsync({
        email: values.email,
        name: `${values.first_name} ${values.last_name}`,
        role: values.role.toLowerCase(),
      });

      onSuccess(values.email);
    } catch {}
  });

  return (
    <form onSubmit={onSubmit} className="w-full space-y-5">
      {inviteStaff.isError && (
        <AlertBanner variant="error">
          {(inviteStaff.error as Error)?.message}
        </AlertBanner>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          id="last_name"
          label="Last name"
          error={errors.last_name?.message}
          className="text-sm"
        >
          <Input
            id="last_name"
            type="text"
            autoComplete="family-name"
            disabled={isSubmitting}
            {...register("last_name")}
            placeholder="Enter your last name"
            className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
          />
        </FormField>

        <FormField
          id="first_name"
          label="First name"
          error={errors.first_name?.message}
          className="text-sm"
        >
          <Input
            id="first_name"
            type="text"
            autoComplete="given-name"
            disabled={isSubmitting}
            {...register("first_name")}
            placeholder="Enter your first name"
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
          autoComplete="email"
          disabled={isSubmitting}
          {...register("email")}
          placeholder="Enter your email address"
          className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
        />
      </FormField>

      <FormField
        id="role"
        label="Role"
        error={errors.role?.message}
        className="text-sm"
      >
        <CustomSelect
          placeholder="Select role"
          options={["Admin", "Tutor"]}
          value={role ?? ""}
          onChange={(value) =>
            setValue("role", value, { shouldValidate: true })
          }
        />
      </FormField>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="primary"
          size="lg"
          onClick={onClose}
          className="rounded-[30px] bg-[#E2E8F0] text-[#1D1D1D] hover:bg-[#D7DFEC]"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting || inviteStaff.isPending}
          className="rounded-[30px] text-[var(--color-surface)]"
        >
          {isSubmitting || inviteStaff.isPending ? "Sending..." : "Send invite"}
        </Button>
      </div>
    </form>
  );
}

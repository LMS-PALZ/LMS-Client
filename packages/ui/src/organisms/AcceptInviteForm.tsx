"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useacceptInviteMutation, useSession } from "@ssu/queries";
import { acceptInviteSchema } from "@ssu/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import type { z } from "zod";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../atoms/Button";
import { FormField } from "../molecules/FormField";
import { Input } from "../atoms/Input";
import { AuthFormSkeleton } from "../skeletons/AuthFormSkeleton";

interface AcceptInviteFormProps {
  onSuccessRedirect?: string;
  token: string;
  email?: string;
  requireSessionCheck?: boolean;
  logoSrc?: string;
  title?: string;
  description?: string;
}

type FormValues = z.infer<typeof acceptInviteSchema>;

export function AcceptInviteForm({
  token,
  email = "",
  onSuccessRedirect = "/success",
  requireSessionCheck = true,
  logoSrc = "/firstlogo.png",
  description = "Enter a new password below to change your password",
}: AcceptInviteFormProps) {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const [showPw, setShowPw] = useState(false);
  const acceptInvite = useacceptInviteMutation();
  const inviteEmail = decodeURIComponent(email).trim();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(acceptInviteSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: inviteEmail,
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await acceptInvite.mutateAsync({
        email: values.email.trim(),
        password: values.password,
        token,
      });

      setTimeout(() => router.replace(onSuccessRedirect), 1500);
    } catch {}
  });

  if (sessionLoading) {
    return (
      <AuthLayout>
        <AuthFormSkeleton fieldCount={2} showRememberRow={false} />
      </AuthLayout>
    );
  }

  if (requireSessionCheck && session) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <div className="w-[120px] py-7">
          <img src={logoSrc} alt="" loading="eager" />
        </div>
        <h1 className="text-sm text-[24px] font-bold text-[#1F2937] mb-3 sm:text-[23px]">
          Join The Skill Scale Up Team
        </h1>
        <p className="text-sm text-neutral-900 mb-6 text-center">
          {description}
        </p>
        <form onSubmit={onSubmit} className="space-y-6 w-full max-w-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="firstName"
              label="First name"
              error={errors.firstName?.message}
              className="text-sm"
            >
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                disabled={isSubmitting}
                {...register("firstName")}
                placeholder="Enter your first name"
                className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
              />
            </FormField>

            <FormField
              id="lastName"
              label="Last name"
              error={errors.lastName?.message}
              className="text-sm"
            >
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                disabled={isSubmitting}
                {...register("lastName")}
                placeholder="Enter your last name"
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
              disabled={isSubmitting || Boolean(inviteEmail)}
              readOnly={Boolean(inviteEmail)}
              {...register("email")}
              placeholder="Enter your email address"
              className="rounded-[12px] placeholder:text-sm"
            />
          </FormField>
          <FormField
            id="password"
            label="Password"
            error={errors.password?.message}
          >
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("password")}
                placeholder="Enter your password"
                className="rounded-[12px]"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeClosed className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormField>
          <FormField
            id="confirmPassword"
            label="Confirm Password"
            error={errors.confirmPassword?.message}
          >
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                disabled={isSubmitting}
                {...register("confirmPassword")}
                placeholder="Re-enter your new password"
                className="rounded-[12px]"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeClosed className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormField>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full rounded-[30px] text-[var(--color-surface)]"
            loading={isSubmitting || acceptInvite.isPending}
            disabled={isSubmitting || acceptInvite.isPending}
          >
            Join team
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

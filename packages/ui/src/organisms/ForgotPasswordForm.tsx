"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation, useSession } from "@ssu/queries";
import { forgotPasswordSchema } from "@ssu/schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AlertBanner } from "../molecules/AlertBanner";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../atoms/Button";
import { FormField } from "../molecules/FormField";
import { Input } from "../atoms/Input";
import { Spinner } from "../atoms/Spinner";

type FormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onSuccessRedirect?: string;
  showLoginLink?: boolean;
  requireSessionCheck?: boolean;
  logoSrc?: string;
  title?: string;
  description?: string;
  loginPath?: string;
}

export function ForgotPasswordForm({
  onSuccessRedirect = "/login",
  requireSessionCheck = true,
  logoSrc = "/firstlogo.png",
  title = "Reset password",
  description = "Enter the email associated with your account",
  loginPath = "/login",
}: ForgotPasswordFormProps) {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const forgotPassword = useForgotPasswordMutation();
  const [banner, setBanner] = useState<{
    variant: "error" | "warning" | "success";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setBanner(null);
    const res = await forgotPassword.mutateAsync(values);
    if (res.ok) {
      setBanner({ variant: "success", message: res.message });
      setTimeout(() => {
        router.replace(onSuccessRedirect);
      }, 2000);
      return;
    }
    setBanner({ variant: "error", message: res.message });
  });

  if (sessionLoading) {
    return null;
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
          {title}
        </h1>
        <p className="text-sm text-neutral-900 mb-6 text-center">
          {description}
        </p>
        {banner && (
          <div className="mb-4 text-center">
            <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6 w-full max-w-sm">
          <FormField id="email" label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              {...register("email")}
              placeholder="Enter your email address"
              className="rounded-[12px]"
            />
          </FormField>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full rounded-[30px] text-[var(--color-surface)]"
            disabled={isSubmitting || forgotPassword.isPending}
          >
            {isSubmitting || forgotPassword.isPending ? (
              <Spinner className="h-5 w-5 animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>
          <div className="text-center pt-3">
            Remember your password?{" "}
            <strong
              className="cursor-pointer text-[#094D2B]"
              onClick={() => router.push(loginPath)}
            >
              Login here
            </strong>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

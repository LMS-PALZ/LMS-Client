"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clearStudentAuth } from "@ssu/api";
import { sessionKey, useHubStudentSetPasswordMutation } from "@ssu/queries";
import { resetPasswordSchema } from "@ssu/schema";
import { AuthLayout, Button, FormField, Input } from "@ssu/ui";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type FormValues = z.infer<typeof resetPasswordSchema>;

export default function HubStudentSetPasswordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() ?? "";

  const setPassword = useHubStudentSetPasswordMutation();
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    clearStudentAuth();
    void queryClient.setQueryData(sessionKey, null);
  }, [queryClient]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const isBusy = isSubmitting || setPassword.isPending;

  const onSubmit = handleSubmit(async (values) => {
    try {
      await setPassword.mutateAsync({ email, password: values.password });
      setTimeout(() => router.replace("/login"), 1200);
    } catch {
      /* Toasts handled in useHubStudentSetPasswordMutation */
    }
  });

  if (!email) {
    return (
      <AuthLayout>
        <div className="flex flex-col items-center text-center">
          <div className="w-[120px] py-7">
            <img src="/firstlogo.png" alt="Logo" loading="eager" />
          </div>
          <h1 className="mb-3 text-[23px] font-bold text-[#1F2937]">
            Invalid link
          </h1>
          <p className="mb-6 max-w-[380px] text-sm text-neutral-900">
            This password link is incomplete. Open the link from your admission
            email again, or contact support.
          </p>
          <Link
            href="/login"
            className="text-sm font-medium text-[#4E845F] hover:underline"
          >
            Go to login
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <div className="w-[120px] py-7">
          <img src="/firstlogo.png" alt="Logo" loading="eager" />
        </div>

        <h1 className="mb-3 text-[26px] font-bold text-[#1F2937] sm:text-[23px]">
          Set your password
        </h1>

        <p className="mb-6 max-w-[380px] text-center text-sm text-neutral-900">
          Create a password for <span className="font-semibold">{email}</span>{" "}
          to secure your account and continue to your profile setup.
        </p>

        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
          <FormField
            id="password"
            label="Choose a Password"
            error={errors.password?.message}
          >
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="new-password"
                disabled={isBusy}
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
                disabled={isBusy}
                {...register("confirmPassword")}
                placeholder="Re-enter your password"
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
            loading={isBusy}
            disabled={isBusy}
          >
            Continue
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

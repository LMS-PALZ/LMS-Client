"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clearStudentAuth } from "@ssu/api";
import { sessionKey, useSetPasswordMutation } from "@ssu/queries";
import { useQueryClient } from "@tanstack/react-query";
import { resetPasswordSchema } from "@ssu/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import type { z } from "zod";

import { AuthLayout } from "@ssu/ui";
import { Button } from "@ssu/ui";
import { FormField } from "@ssu/ui";
import { Input } from "@ssu/ui";
type FormValues = z.infer<typeof resetPasswordSchema>;

export default function SetPasswordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const setPassword = useSetPasswordMutation();

  useEffect(() => {
    clearStudentAuth();
    void queryClient.setQueryData(sessionKey, null);
  }, [queryClient]);

  const [showPw, setShowPw] = useState(false);

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

  const onSubmit = handleSubmit(async (values) => {
    try {
      await setPassword.mutateAsync({ password: values.password });
      localStorage.removeItem("reset-email");
      setTimeout(() => router.replace("/login"), 1200);
    } catch {
      /* Toasts handled in useSetPasswordMutation */
    }
  });

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <div className="w-[120px] py-7">
          <img src="/firstlogo.png" alt="Logo" loading="eager" />
        </div>

        <h1 className="mb-3 text-[26px] font-bold text-[#1F2937] sm:text-[23px]">
          Set your password
        </h1>

        <p className="mb-6 max-w-[380px] text-center text-neutral-900 text-sm">
          Create a password to secure your account and continue to your profile
          setup.
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
            loading={isSubmitting || setPassword.isPending}
            disabled={isSubmitting || setPassword.isPending}
          >
            Continue
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

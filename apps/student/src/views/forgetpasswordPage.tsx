"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForgotPasswordMutation, useSession } from "@ssu/queries";
import { forgotPasswordSchema } from "@ssu/schema";
import {
  AlertBanner,
  AuthLayout,
  Button,
  FormField,
  Input,
  Spinner,
} from "@ssu/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type FormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgetPasswordPage() {
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
        router.replace("/resetpassword");
      }, 2000);
      return;
    }
    setBanner({ variant: "error", message: res.message });
  });

  if (sessionLoading) {
    return null;
  }
  if (session) {
    return null;
  }

  return (
    <AuthLayout>
      <div className="flex flex-col items-center">
        <div className="w-[120px] py-7">
          <img
            src="/firstlogo.png"
            alt="Chiggy Nsofor Foundation"
            loading="eager"
          />
        </div>
        <h1 className="text-sm text-[24px] font-bold text-[#1F2937] mb-3 sm:text-[23px]">
          Forgot password?
        </h1>
        <p className="text-sm text-neutral-900 mb-6 text-center">
          Enter the email associated with your account
        </p>
        {banner && (
          <div className="mb-4">
            <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6 w-full max-w-sm">
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
              onClick={() => router.push("/login")}
            >
              Login here
            </strong>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation, useSession } from "@ssu/queries";
import { loginSchema } from "@ssu/schema";
import { AlertBanner, AuthLayout, Button, FormField, Input } from "@ssu/ui";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type FormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const login = useLoginMutation();
  const [showPw, setShowPw] = useState(false);
  const [banner, setBanner] = useState<{
    variant: "error" | "warning";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (session) {
      router.replace("/");
    }
  }, [session, router]);

  const onSubmit = handleSubmit(async (values) => {
    setBanner(null);
    const res = await login.mutateAsync(values);
    if (res.ok) {
      router.replace("/");
      return;
    }
    if (res.code === "pending_approval") {
      setBanner({ variant: "warning", message: res.message });
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
        <div className="w-[120px] py-7" >
          <img src="/firstlogo.png" alt="Chiggy Nsofor Foundation" loading='eager' />
        </div>
        <h1 className="text-sm text-[24px] font-bold text-[#1F2937] mb-3 sm:text-[23px]">Welcome back!</h1>
        <p className="text-sm text-neutral-900 mb-6">
          Sign in to continue to your dashboard.
        </p>
        {banner && (
          <div className="mb-4">
            <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6 w-full max-w-sm">
          <FormField id="email" label="Email" error={errors.email?.message} className="text-sm">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              {...register("email")}
              placeholder="Enter your email address"
              className="rounded-[12px] placeholder:text-sm"
            />
          </FormField>
          <FormField
            id="password"
            label="Password"
            error={errors.password?.message}
            className="text-sm"
          >
            <div className="relative">
              <Input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                disabled={isSubmitting}
                {...register("password")}
                placeholder="Enter your password"
                className="rounded-[12px] placeholder:text-sm"
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
            loading={isSubmitting || login.isPending}
          >
            Login
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation, useSession } from "@ssu/queries";
import { loginSchema } from "@ssu/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import type { z } from "zod";
// import type { UserRole } from "@ssu/types";
import { AlertBanner } from "../molecules/AlertBanner";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import { FormField } from "../molecules/FormField";
import { Input } from "../atoms/Input";
import { Spinner } from "../atoms/Spinner";

interface LoginFormProps {
  role: "student" | "admin" | "tutor" | "trainer";
  onSuccessRedirect?: string;
  requireSessionCheck?: boolean;
  logoSrc?: string;
  title?: string;
  description?: string;
  forgotPasswordLink?: string;
  signupLink?: string;
  showSignupLink?: boolean;
  useAuthLayout?: boolean;
}

type FormValues = z.infer<typeof loginSchema>;

export function LoginForm({
  // role,
  onSuccessRedirect = "/",
  requireSessionCheck = true,
  logoSrc = "/firstlogo.png",
  title = "Welcome back!",
  description = "Sign in to continue to your dashboard.",
  forgotPasswordLink = "/forgetpassword",
  signupLink = "/signup",
  showSignupLink = false,
  useAuthLayout = true,
}: LoginFormProps) {
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
      router.replace(onSuccessRedirect);
    }
  }, [session, router, onSuccessRedirect]);

  const onSubmit = async (values: FormValues) => {
    setBanner(null);
    try {
      const res = await login.mutateAsync(values);
      if (res.ok) {
        router.replace(onSuccessRedirect);
        return;
      }
      if (res.code === "pending_approval") {
        setBanner({ variant: "warning", message: res.message });
        return;
      }
      setBanner({ variant: "error", message: res.message });
    } catch (error: any) {
      setBanner({
        variant: "error",
        message: error?.message || "Login failed. Please try again.",
      });
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  if (sessionLoading) {
    return null;
  }
  if (requireSessionCheck && session) {
    return null;
  }

  const formContent = (
    <div className="flex flex-col items-center">
      <div className="w-[120px] py-7">
        <img src={logoSrc} alt="" loading="eager" />
      </div>
      <h1 className="text-sm text-[26px] font-bold text-[#1F2937] mb-3 sm:text-[23px]">
        {title}
      </h1>
      <p className="text-sm text-neutral-900 mb-6">{description}</p>
      {banner && (
        <div className="mb-4">
          <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
        </div>
      )}
      <form onSubmit={handleFormSubmit} className="space-y-6 w-full max-w-sm">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox id="rememberMe" {...register("rememberMe")} />
            <label
              htmlFor="rememberMe"
              className="text-sm text-neutral-700 cursor-pointer"
            >
              Remember me
            </label>
          </div>
          <Link
            href={forgotPasswordLink}
            className="text-sm text-[#0D693B] hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full rounded-[30px] text-[var(--color-surface)]"
          disabled={isSubmitting || login.isPending}
        >
          {isSubmitting || login.isPending ? (
            <Spinner className="h-5 w-5 animate-spin" />
          ) : (
            "Login"
          )}
        </Button>
      </form>
      {showSignupLink && (
        <p className="mt-6 text-sm text-neutral-600">
          Don't have an account?{" "}
          <Link
            href={signupLink}
            className="font-semibold text-[#0D693B] hover:underline"
          >
            Sign up here
          </Link>
        </p>
      )}
    </div>
  );

  if (useAuthLayout) {
    return <AuthLayout>{formContent}</AuthLayout>;
  }

  return formContent;
}

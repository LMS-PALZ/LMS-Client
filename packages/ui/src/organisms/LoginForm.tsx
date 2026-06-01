"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { isStudentAuthenticated } from "@ssu/api";
import { useLoginMutation, useSession } from "@ssu/queries";
import { loginSchema } from "@ssu/schema";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import Link from "next/link";
import type { z } from "zod";
// import type { UserRole } from "@ssu/types";
import { AuthLayout } from "../layouts/AuthLayout";
import { Button } from "../atoms/Button";
import { Checkbox } from "../atoms/Checkbox";
import { FormField } from "../molecules/FormField";
import { Input } from "../atoms/Input";
import { AuthFormSkeleton } from "../skeletons/AuthFormSkeleton";

interface LoginFormProps {
  role?: "student" | "admin" | "tutor" | "trainer";
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
  role = "student",
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
  const portal =
    role === "admin"
      ? "admin"
      : role === "tutor" || role === "trainer"
        ? "tutor"
        : "student";
  const loginMutation = useLoginMutation(portal);
  const isAuthenticated =
    portal === "student" ? isStudentAuthenticated() : Boolean(session);
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!requireSessionCheck) return;
    if (isAuthenticated) {
      router.replace(onSuccessRedirect);
    }
  }, [isAuthenticated, requireSessionCheck, router, onSuccessRedirect]);

  const onSubmit = async (values: FormValues) => {
    try {
      const res = await loginMutation.mutateAsync(values);
      if (res.ok) {
        router.replace(onSuccessRedirect);
        router.refresh();
      }
    } catch {
      /* Errors are surfaced via toast in useLoginMutation */
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit);

  if (sessionLoading) {
    const skeleton = (
      <AuthFormSkeleton fieldCount={2} showFooterLink={showSignupLink} />
    );
    return useAuthLayout ? <AuthLayout>{skeleton}</AuthLayout> : skeleton;
  }
  if (requireSessionCheck && isAuthenticated) {
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
          loading={isSubmitting || loginMutation.isPending}
          disabled={isSubmitting || loginMutation.isPending}
        >
          Login
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

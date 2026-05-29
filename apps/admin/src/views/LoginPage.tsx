"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation, useSession } from "@ssu/queries";
import { loginSchema } from "@ssu/schema";
import {
  AlertBanner,
  AuthLayout,
  Button,
  FormField,
  Input,
  Spinner,
} from "@ssu/ui";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type FormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const login = useLoginMutation("admin");
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
      <div>
        <h1 className="text-h1 text-neutral-900 mb-2">Admin sign in</h1>
        <p className="text-small text-neutral-500 mb-6">
          Demo: <strong>admin@skillscaleup.dev</strong> with any non-empty
          password.
        </p>
        {banner && (
          <div className="mb-4">
            <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField id="email" label="Email" error={errors.email?.message}>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
              {...register("email")}
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
                autoComplete="current-password"
                disabled={isSubmitting}
                {...register("password")}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-neutral-500 hover:bg-neutral-100"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </FormField>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isSubmitting || login.isPending}
          >
            {isSubmitting || login.isPending ? (
              <Spinner className="h-5 w-5 animate-spin" />
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation, useSession } from "@ssu/queries";
import { resetPasswordSchema } from "@ssu/schema";
import { AlertBanner, AuthLayout, Button, FormField, Input } from "@ssu/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

type FormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, isLoading: sessionLoading } = useSession();
    const resetPassword = useResetPasswordMutation();
    const [banner, setBanner] = useState<{
        variant: "error" | "warning" | "success";
        message: string;
    } | null>(null);
    const [showPw, setShowPw] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: { password: "", confirmPassword: "" },
    });

    const onSubmit = handleSubmit(async (values) => {
        setBanner(null);
        const token = searchParams.get("token");
        
        if (!token) {
            setBanner({ variant: "error", message: "Invalid reset link" });
            return;
        }

        const res = await resetPassword.mutateAsync({
            token,
            password: values.password,
            confirmPassword: values.confirmPassword,
        });

        if (res.ok) {
            setBanner({ variant: "success", message: res.message });
            setTimeout(() => {
                router.replace("/login");
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
                <div className="w-[120px] py-7" >
                    <img src="/firstlogo.png" alt="" loading='eager' />
                </div>
                <h1 className="text-2xl font-light-bold text-neutral-900 mb-2">Set your password</h1>
                <p className="text-small text-neutral-900 mb-6">
                   Create a password to secure your account and continue to your profile setup.
                </p>
                {banner && (
                    <div className="mb-4">
                        <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
                    </div>
                )}
                <form onSubmit={onSubmit} className="space-y-6 w-full max-w-sm">
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
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
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
                                placeholder="Confirm your password"
                                className="rounded-[12px]"
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
                        className="w-full rounded-[30px] text-[var(--color-surface)]"
                        loading={isSubmitting || resetPassword.isPending}
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        </AuthLayout>
    );
}

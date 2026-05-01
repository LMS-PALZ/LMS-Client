"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation, useSession } from "@ssu/queries";
import { forgotPasswordSchema } from "@ssu/schema";
import { AlertBanner, AuthLayout, Button, FormField, Input } from "@ssu/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeClosed } from "lucide-react";
import { z } from "zod";

const studentResetPasswordSchema = forgotPasswordSchema
    .extend({
        password: z.string().min(8, "Use at least 8 characters"),
        confirmPassword: z.string().min(1, "Confirm your password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords must match",
        path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof studentResetPasswordSchema>;

export function ResetPasswordPage() {
    const router = useRouter();
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
        resolver: zodResolver(studentResetPasswordSchema),
        defaultValues: { email: "", password: "", confirmPassword: "" },
    });

    const onSubmit = handleSubmit(async (values) => {
        setBanner(null);

        const res = await resetPassword.mutateAsync({
            email: values.email,
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
                    <img src="/firstlogo.png" alt="Chiggy Nsofor Foundation" loading='eager' />
                </div>
                <h1 className="text-sm text-[24px] font-bold text-[#1F2937] mb-3 sm:text-[23px]">Set your password</h1>
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
                        id="password"
                        label="Password"
                        error={errors.password?.message}
                        className="text-sm"
                    >
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPw ? "text" : "password"}
                                autoComplete="new-password"
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
                                    <EyeClosed className="h-4 w-4" />
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
                        className="text-sm"
                    >
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                type={showPw ? "text" : "password"}
                                autoComplete="new-password"
                                disabled={isSubmitting}
                                {...register("confirmPassword")}
                                placeholder="Confirm your password"
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
                        loading={isSubmitting || resetPassword.isPending}
                    >
                        Reset Password
                    </Button>
                    <div className="text-center text-sm pt-3">
                        Remember your password? <strong className="cursor-pointer text-[#094D2B]" onClick={() => router.push("/login")}>Login here</strong>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { clearStudentAuth, isStudentAuthenticated } from "@ssu/api";
import {
  mutationToast,
  sessionKey,
  usePrograms,
  useSignupMutation,
} from "@ssu/queries";
import { useQueryClient } from "@tanstack/react-query";
import { signUpSchema } from "@ssu/schema";
import {
  AuthLayout,
  Button,
  FormField,
  Input,
  SelectMenuSkeleton,
  Skeleton,
} from "@ssu/ui";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { isStudentSignupEnabled } from "@/lib/signup-availability";
import { persistSignupSession } from "@/lib/signup-session";

type FormValues = z.infer<typeof signUpSchema>;

export function SignupPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const signupDisabled = !isStudentSignupEnabled;

  useEffect(() => {
    if (isStudentAuthenticated()) return;
    clearStudentAuth();
    void queryClient.setQueryData(sessionKey, null);
  }, [queryClient]);

  const {
    data: programs,
    isLoading: programsLoading,
    error: programsError,
  } = usePrograms();

  const signup = useSignupMutation();

  const [isProgramOpen, setIsProgramOpen] = useState(false);
  const programMenuRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      program: "",
    },
  });

  const selectedProgram = watch("program");

  const onSubmit = handleSubmit(async (values) => {
    if (signupDisabled) return;
    const res = await signup.mutateAsync(values);

    const matchedProgram = programs?.find((p) => p.slug === values.program);

    // Existing unpaid signup — resume at payment (email already verified upstream).
    if (!res.status && res.code === "payment_required") {
      persistSignupSession({
        values,
        programName: matchedProgram?.title,
        applicationFee: matchedProgram?.priceAmount,
        programId: res.data?.programId,
        id: "",
      });

      mutationToast.info("Continue to payment to complete your registration.");
      router.replace("/paymentdetail");
      return;
    }

    if (!res.status) {
      return;
    }

    persistSignupSession({
      values,
      programName: matchedProgram?.title,
      applicationFee: matchedProgram?.priceAmount,
      id: res.data?.id ?? "",
    });

    setTimeout(() => {
      router.replace("/confirmcode?signup");
    }, 1500);
  });

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!programMenuRef.current?.contains(event.target as Node)) {
        setIsProgramOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <AuthLayout contentAlign="top">
      <div className="flex w-full flex-col items-center">
        <div className="w-[120px] py-5">
          <img
            src="/firstlogo.png"
            alt="Chiggy Nsofor Foundation"
            loading="eager"
          />
        </div>

        <h1 className="mb-2 text-[25px] font-bold text-[#1F2937] sm:text-[23px]">
          Let&apos;s begin your journey
        </h1>

        <p className="mb-5 text-center text-sm text-neutral-900">
          It only takes a moment to begin.
        </p>

        {signupDisabled ? (
          <div className="mb-5 w-full max-w-sm rounded-[12px] border border-[#F3D9A8] bg-[#FFF8EB] px-4 py-3 text-center text-sm text-[#8A5A00]">
            Signup is temporarily unavailable. Please check back later or log in
            if you already have an account.
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="last_name"
              label="Last name"
              error={errors.last_name?.message}
              className="text-sm"
            >
              <Input
                id="last_name"
                type="text"
                autoComplete="family-name"
                disabled={signupDisabled || isSubmitting}
                {...register("last_name")}
                placeholder="Enter your last name"
                className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
              />
            </FormField>

            <FormField
              id="first_name"
              label="First name"
              error={errors.first_name?.message}
              className="text-sm"
            >
              <Input
                id="first_name"
                type="text"
                autoComplete="given-name"
                disabled={signupDisabled || isSubmitting}
                {...register("first_name")}
                placeholder="Enter your first name"
                className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
              />
            </FormField>
          </div>

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
              disabled={signupDisabled || isSubmitting}
              {...register("email")}
              placeholder="Enter your email address"
              className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
            />
          </FormField>

          <FormField
            id="phone_number"
            label="Phone Number"
            error={errors.phone_number?.message}
            className="text-sm"
          >
            <Input
              id="phone_number"
              type="tel"
              autoComplete="tel"
              disabled={signupDisabled || isSubmitting}
              {...register("phone_number")}
              placeholder="0803 555 7878"
              className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
            />
          </FormField>

          <FormField
            id="program"
            label="Program"
            error={errors.program?.message}
            className="text-sm"
          >
            <div ref={programMenuRef} className="relative">
              <input type="hidden" {...register("program")} />

              <button
                id="program"
                type="button"
                disabled={signupDisabled || isSubmitting || programsLoading}
                onClick={() => setIsProgramOpen((current) => !current)}
                className="flex h-11 w-full items-center justify-between rounded-[12px] border border-[#D7DFEC] bg-white px-4 text-left text-[17px] text-[#1F2937] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                aria-haspopup="listbox"
                aria-expanded={isProgramOpen}
              >
                <span
                  className={
                    selectedProgram ? "text-[#1F2937]" : "text-[#B3BDC9]"
                  }
                >
                  {programs?.find((item) => item.slug === selectedProgram)
                    ?.title || "Select your preferred program"}
                </span>

                {programsLoading ? (
                  <Skeleton className="h-5 w-5 rounded-md" aria-hidden />
                ) : (
                  <ChevronDown
                    className={`h-5 w-5 text-[#1F2937] transition-transform ${
                      isProgramOpen ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>

              {isProgramOpen && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-[250px] overflow-y-auto rounded-[18px] border border-[#EEF2F7] bg-white py-2 shadow-[0_20px_40px_rgba(15,23,42,0.10)]">
                  {programsLoading ? (
                    <SelectMenuSkeleton rows={4} />
                  ) : programsError ? (
                    <div className="px-4 py-3 text-sm text-red-500">
                      Failed to load programs
                    </div>
                  ) : programs?.length ? (
                    programs.map((program) => {
                      const isSelected = selectedProgram === program.slug;

                      return (
                        <button
                          key={program.id}
                          type="button"
                          className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#F8FAFC]"
                          onClick={() => {
                            setValue("program", program.slug, {
                              shouldDirty: true,
                              shouldTouch: true,
                              shouldValidate: true,
                            });
                            setIsProgramOpen(false);
                          }}
                        >
                          <span className="flex items-center gap-3 text-[17px] text-[#1F2937]">
                            <span className="flex w-4 items-center justify-center">
                              <Check
                                className={`h-4 w-4 text-[#0D6939] ${
                                  isSelected ? "opacity-100" : "opacity-0"
                                }`}
                              />
                            </span>
                            <span className="text-sm">{program.title}</span>
                          </span>
                          <span className="text-sm font-medium text-[#0D6939]">
                            ₦{program.priceAmount.toLocaleString()}
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="px-4 py-3 text-sm text-[#6B7280]">
                      No programs available
                    </div>
                  )}
                </div>
              )}
            </div>
          </FormField>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full rounded-[30px] text-[var(--color-surface)]"
            loading={!signupDisabled && (isSubmitting || signup.isPending)}
            disabled={signupDisabled || isSubmitting || signup.isPending}
          >
            {signupDisabled ? "Signup unavailable" : "Signup"}
          </Button>

          <p className="pt-2 text-center text-sm text-neutral-700">
            <span className="inline whitespace-nowrap">
              Already registered for a program?{" "}
              <Link
                href="/login?fresh=1"
                className="font-semibold text-[#094D2B] hover:underline"
              >
                Login to your dashboard
              </Link>
            </span>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
}

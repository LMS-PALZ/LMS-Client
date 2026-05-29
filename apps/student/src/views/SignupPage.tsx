"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useAvailablePrograms,
  useSignupMutation,
  useSession,
} from "@ssu/queries";
import { signUpSchema } from "@ssu/schema";
import {
  AlertBanner,
  Button,
  AuthLayout,
  FormField,
  Input,
  Spinner,
} from "@ssu/ui";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import type { AvailableProgram } from "@ssu/types";
import { writeStudentSignupDetails } from "@/lib/signup-details";

type FormValues = z.infer<typeof signUpSchema>;

export function SignupPage() {
  const router = useRouter();
  const { data: session, isLoading: sessionLoading } = useSession();
  const signup = useSignupMutation();
  const programsQuery = useAvailablePrograms();
  const [banner, setBanner] = useState<{
    variant: "error" | "warning";
    message: string;
  } | null>(null);
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
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      program: "",
    },
  });
  const selectedProgramId = watch("program");

  const programOptions: AvailableProgram[] = useMemo(
    () => programsQuery.data ?? [],
    [programsQuery.data],
  );

  const selectedProgram = useMemo(
    () => programOptions.find((p) => p.id === selectedProgramId) ?? null,
    [programOptions, selectedProgramId],
  );

  const onSubmit = handleSubmit(async (values) => {
    setBanner(null);
    const res = await signup.mutateAsync(values);
    if (res.ok) {
      const program = programOptions.find((p) => p.id === values.program);
      writeStudentSignupDetails({
        ...values,
        applicationFee: program?.applicationFee,
        programName: program?.name,
      });
      router.replace("/confirmcode");
      return;
    }
    if (res.code === "pending_approval") {
      setBanner({ variant: "warning", message: res.message });
      return;
    }
    setBanner({ variant: "error", message: res.message });
  });

  useEffect(() => {
    if (session) {
      router.replace("/home");
    }
  }, [session, router]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!programMenuRef.current?.contains(event.target as Node)) {
        setIsProgramOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

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
          Let’s begin your journey
        </h1>
        <p className="text-sm text-neutral-900 mb-6 text-center">
          It only takes a moment to begin.
        </p>
        {banner && (
          <div className="mb-5 w-full max-w-sm">
            <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
          </div>
        )}
        {programsQuery.isError && (
          <div className="mb-5 w-full max-w-sm">
            <AlertBanner variant="error">
              Could not load programs. Refresh the page and try again.
            </AlertBanner>
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-6 w-full max-w-sm">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              id="lastName"
              label="Last name"
              error={errors.lastName?.message}
              className="text-sm"
            >
              <Input
                id="lastName"
                type="text"
                autoComplete="family-name"
                disabled={isSubmitting}
                {...register("lastName")}
                placeholder="Enter your last name"
                className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
              />
            </FormField>
            <FormField
              id="firstName"
              label="First name"
              error={errors.firstName?.message}
              className="text-sm"
            >
              <Input
                id="firstName"
                type="text"
                autoComplete="given-name"
                disabled={isSubmitting}
                {...register("firstName")}
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
              disabled={isSubmitting}
              {...register("email")}
              placeholder="Enter your email address"
              className="rounded-[12px] placeholder:text-sm placeholder:text-[#B3BDC9]"
            />
          </FormField>

          <FormField
            id="phoneNumber"
            label="Phone Number"
            error={errors.phoneNumber?.message}
            className="text-sm"
          >
            <Input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              disabled={isSubmitting}
              {...register("phoneNumber")}
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
                disabled={
                  isSubmitting ||
                  programsQuery.isLoading ||
                  programOptions.length === 0
                }
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
                  {programsQuery.isLoading
                    ? "Loading programs…"
                    : (selectedProgram?.name ??
                      "Select your preferred program")}
                </span>
                <ChevronDown
                  className={`h-5 w-5 text-[#1F2937] transition-transform ${isProgramOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isProgramOpen && programOptions.length > 0 && (
                <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 max-h-[250px] overflow-y-auto rounded-[18px] border border-[#EEF2F7] bg-white py-2 shadow-[0_20px_40px_rgba(15,23,42,0.10)]">
                  {programOptions.map((program) => {
                    const isSelected = selectedProgramId === program.id;
                    return (
                      <button
                        key={program.id}
                        type="button"
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#F8FAFC]"
                        onClick={() => {
                          setValue("program", program.id, {
                            shouldDirty: true,
                            shouldTouch: true,
                            shouldValidate: true,
                          });
                          setIsProgramOpen(false);
                        }}
                      >
                        <span className="flex items-center gap-3 text-[17px] text-[#1F2937]">
                          <Check
                            className={`h-4 w-4 text-[#0D6939] ${isSelected ? "opacity-100" : "opacity-0"}`}
                          />
                          <span>{program.name}</span>
                        </span>
                        {program.applicationFee > 0 && (
                          <span className="text-[17px] text-[#7A8594]">
                            N{program.applicationFee.toLocaleString()}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </FormField>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full rounded-[30px] text-[var(--color-surface)]"
            loading={isSubmitting || signup.isPending}
          >
            {isSubmitting || signup.isPending ? (
              <Spinner className="h-5 w-5 animate-spin" />
            ) : (
              "Signup"
            )}
          </Button>
        </form>
        <p className="pt-4 pb-2 text-center text-sm text-neutral-700">
          Already registered for a program?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#094D2B] hover:underline"
          >
            Login to your dashboard
          </Link>
        </p>
        <div className="mb-8" aria-hidden />
      </div>
    </AuthLayout>
  );
}

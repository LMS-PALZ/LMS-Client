"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSignupMutation, usePrograms } from "@ssu/queries";
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
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { writeStudentSignupDetails } from "@/lib/signup-details";
import { useSignupStore } from "@ssu/store";

type FormValues = z.infer<typeof signUpSchema>;

export function SignupPage() {
  const router = useRouter();
  const setUser = useSignupStore((state) => state.setUser);

  const {
    data: programs,
    isLoading: programsLoading,
    error: programsError,
  } = usePrograms();

  const signup = useSignupMutation();

  const [banner, setBanner] = useState<{
    variant: "error" | "warning" | "success";
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
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      program: "",
    },
  });

  const selectedProgram = watch("program");

  const onSubmit = handleSubmit(async (values) => {
    setBanner(null);

    const res = await signup.mutateAsync(values);

    if (!res.status) {
      setBanner({
        variant: "error",
        message: res.message,
      });

      return;
    }

    const programTitle =
      programs?.find((p) => p.slug === values.program)?.title ?? "";

    setBanner({
      variant: "success",
      message: res.message,
    });

    writeStudentSignupDetails(values);

    setUser({
      id: res.data?.id ?? "",
      email: values.email,
      role: "student",
      first_name: values.first_name,
      last_name: values.last_name,
      phone_number: values.phone_number,
      program: values.program,
      program_title: programTitle,
    });

    setTimeout(() => {
      router.replace("/confirmcode");
    }, 2000);
  });

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!programMenuRef.current?.contains(event.target as Node)) {
        setIsProgramOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

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

        <h1 className="mb-3 text-[25px] font-bold text-[#1F2937] sm:text-[23px]">
          Let's begin your journey
        </h1>

        <p className="mb-6 text-center text-sm text-neutral-900">
          It only takes a moment to begin.
        </p>

        {banner && (
          <div className="mb-5 w-full">
            <AlertBanner variant={banner.variant}>{banner.message}</AlertBanner>
          </div>
        )}

        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-6">
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
                disabled={isSubmitting || programsLoading}
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
                  <Spinner className="h-5 w-5 animate-spin" />
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
                    <div className="flex items-center justify-center py-6">
                      <Spinner className="h-5 w-5 animate-spin" />
                    </div>
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
                            <span className="w-4 flex items-center justify-center">
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
            disabled={isSubmitting || signup.isPending}
          >
            {isSubmitting || signup.isPending ? (
              <Spinner className="h-5 w-5 animate-spin" />
            ) : (
              "Signup"
            )}
          </Button>
        </form>

        <div className="pt-4 text-center text-sm">
          Already have an account?{" "}
          <strong
            className="cursor-pointer text-[#094D2B]"
            onClick={() => router.push("/login")}
          >
            Login here
          </strong>
        </div>
      </div>
    </AuthLayout>
  );
}

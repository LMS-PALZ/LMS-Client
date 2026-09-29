"use client";

import { isPaymentFullySuccessful } from "@ssu/api";
import { useSignupPaymentVerification } from "@ssu/queries";
import { Button, PaymentStatusSkeleton } from "@ssu/ui";
import { Briefcase, FolderClosed, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const welcomeHighlights = [
  {
    title: "Employable Skills",
    description:
      "You'll gain market-relevant skills aligned with today's digital and vocational opportunities.",
    icon: Briefcase,
  },
  {
    title: "Life Skills",
    description:
      "Build discipline, leadership, and emotional intelligence to support personal and professional growth.",
    icon: Heart,
  },
  {
    title: "Portfolio Projects",
    description:
      "Work on real projects you can confidently showcase to employers and clients.",
    icon: FolderClosed,
  },
];

export function WelcomePage() {
  const router = useRouter();
  const { data, isLoading, isError, isFetched } =
    useSignupPaymentVerification();

  const paid = data ? isPaymentFullySuccessful(data) : false;

  useEffect(() => {
    if (!isFetched) return;
    if (isError || !data || !paid) {
      router.replace("/paymentdetail");
    }
  }, [isFetched, isError, data, paid, router]);

  if (isLoading || !paid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <PaymentStatusSkeleton className="min-h-0 py-12" />
      </div>
    );
  }

  return (
    <main className="relative min-h-dvh w-full bg-white">
      <div className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col items-center justify-center px-4 py-12 text-center sm:py-14">
        <div className="mb-6 w-[112px] sm:mb-8 sm:w-[128px]">
          <img
            src="/firstlogo.png"
            alt="Chiggy Nsofor Foundation"
            loading="eager"
            className="h-auto w-full"
          />
        </div>

        <div className="mx-auto max-w-[380px]">
          <h1 className="mb-2 text-[22px] font-bold text-[#1F2937] sm:text-[25px]">
            You&apos;re in.
          </h1>
          <p className="mx-auto mb-7 text-sm leading-6 text-[#6B7280] sm:mb-8 sm:text-[15px]">
            Welcome to the Skill Scale-up Program. Few things to know about your
            journey.
          </p>
        </div>

        <section className="w-full max-w-[560px] rounded-[28px] bg-[#F9FBFD] px-6 py-6 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-8 sm:py-8">
          <div className="space-y-7">
            {welcomeHighlights.map(({ title, description, icon: Icon }) => (
              <article key={title} className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-5 w-5 text-[#64748B]" />
                </div>
                <div>
                  <h2 className="mb-1.5 font-medium text-[#374151] sm:text-[15px]">
                    {title}
                  </h2>
                  <p className="text-sm leading-6 text-[#6B7280] sm:text-[15px]">
                    {description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <Button
          type="button"
          variant="primary"
          className="mt-8 w-[220px] shrink-0 rounded-[30px] text-[var(--color-surface)] sm:mt-10"
          onClick={() => router.push("/setpassword")}
        >
          Let&apos;s get started
        </Button>
      </div>
    </main>
  );
}

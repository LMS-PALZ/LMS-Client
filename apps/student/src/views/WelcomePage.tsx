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
      {/* Top-aligned so the CTA is never clipped by vertical centering */}
      <div className="mx-auto flex w-full max-w-[640px] flex-col items-center px-4 pb-8 pt-14 text-center sm:pt-16">
        <div className="mb-4 w-[100px] sm:w-[112px]">
          <img
            src="/firstlogo.png"
            alt="Chiggy Nsofor Foundation"
            loading="eager"
            className="h-auto w-full"
          />
        </div>

        <div className="mx-auto max-w-[340px]">
          <h1 className="mb-1.5 text-[22px] font-bold text-[#1F2937] sm:text-[23px]">
            You&apos;re in.
          </h1>
          <p className="mx-auto mb-5 text-sm leading-5 text-[#6B7280]">
            Welcome to the Skill Scale-up Program. Few things to know about your
            journey.
          </p>
        </div>

        <section className="w-full max-w-[560px] rounded-[28px] bg-[#F9FBFD] px-6 py-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-8 sm:py-6">
          <div className="space-y-5">
            {welcomeHighlights.map(({ title, description, icon: Icon }) => (
              <article key={title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Icon className="h-4 w-4 text-[#64748B]" />
                </div>
                <div>
                  <h2 className="mb-1 font-medium text-[#374151] sm:text-[15px]">
                    {title}
                  </h2>
                  <p className="text-sm leading-5 text-[#6B7280] sm:text-[15px]">
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
          className="mt-5 w-[200px] shrink-0 rounded-[30px] text-[var(--color-surface)]"
          onClick={() => router.push("/setpassword")}
        >
          Let&apos;s get started
        </Button>
      </div>
    </main>
  );
}

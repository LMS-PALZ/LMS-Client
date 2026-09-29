"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { isPaymentFullySuccessful } from "@ssu/api";
import { useVerifyPayment } from "@ssu/queries";
import { PaymentStatusSkeleton } from "@ssu/ui";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import {
  PAYMENT_CHECKOUT_MESSAGE,
  type PaymentCheckoutMessage,
} from "@/lib/payment-checkout";
import {
  PAYMENT_RESUME_QUERY,
  applySignupResumeToken,
  decodeSignupResume,
  paymentDetailPath,
  resolveSignupSession,
} from "@/lib/signup-session";

function paymentStatusLabel(
  paymentStatus: string,
): "payment pending" | "payment failed" | "payment successful" {
  if (paymentStatus === "successful") return "payment successful";
  if (paymentStatus === "failed") return "payment failed";
  return "payment pending";
}

function useRedirectCountdown(
  enabled: boolean,
  href: string | null,
  seconds = 3,
) {
  const router = useRouter();
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (!enabled || !href) return;

    setRemaining(seconds);
    const interval = window.setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [enabled, href, seconds]);

  useEffect(() => {
    if (!enabled || !href || remaining > 0) return;
    router.replace(href);
  }, [enabled, href, remaining, router]);

  return remaining;
}

function StatusCard({
  label,
  tone,
  countdown,
  showCountdown,
}: {
  label: string;
  tone: "success" | "pending" | "failed";
  countdown: number;
  showCountdown: boolean;
}) {
  const styles = {
    success: {
      border: "border-[#D4E2D8]",
      iconWrap: "bg-[#EEF9ED]",
      icon: "text-[#4E845F]",
      Icon: CheckCircle2,
    },
    pending: {
      border: "border-amber-200",
      iconWrap: "bg-amber-50",
      icon: "text-amber-600",
      Icon: AlertCircle,
    },
    failed: {
      border: "border-red-200",
      iconWrap: "bg-red-50",
      icon: "text-red-600",
      Icon: AlertCircle,
    },
  }[tone];

  const Icon = styles.Icon;

  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-center">
      <div
        className={`w-full max-w-md rounded-[20px] border bg-white px-8 py-10 shadow-sm ${styles.border}`}
      >
        <div
          className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full ${styles.iconWrap}`}
        >
          <Icon className={`h-7 w-7 ${styles.icon}`} aria-hidden />
        </div>
        <h1 className="text-[22px] font-semibold text-[#1D1D1D]">{label}</h1>
        {showCountdown ? (
          <p className="mt-3 text-[14px] leading-6 text-[#6B7280]">
            {countdown > 0 ? `Redirecting… in ${countdown}s` : "Redirecting…"}
          </p>
        ) : (
          <p className="mt-3 text-[14px] leading-6 text-[#6B7280]">
            You can close this window and return to registration.
          </p>
        )}
      </div>
    </section>
  );
}

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const resumeToken = searchParams.get(PAYMENT_RESUME_QUERY);
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    applySignupResumeToken(resumeToken);
    try {
      setIsPopup(Boolean(window.opener && !window.opener.closed));
    } catch {
      setIsPopup(false);
    }
  }, [resumeToken]);

  const paymentDetailHref = paymentDetailPath(
    decodeSignupResume(resumeToken) ?? resolveSignupSession(),
  );

  const { data, isLoading, isError, error } = useVerifyPayment(reference);
  const isPaid = data ? isPaymentFullySuccessful(data) : false;

  useEffect(() => {
    if (!isPopup || !reference) return;
    if (!data && !isError) return;

    const payload: PaymentCheckoutMessage = {
      type: PAYMENT_CHECKOUT_MESSAGE,
      reference,
      paid: Boolean(data && isPaid),
      paymentStatus: data?.paymentStatus,
    };

    try {
      window.opener?.postMessage(payload, window.location.origin);
    } catch {
      // ignore cross-window failures
    }

    const timer = window.setTimeout(() => {
      window.close();
    }, 400);

    return () => window.clearTimeout(timer);
  }, [isPopup, reference, data, isError, isPaid]);

  const redirectHref = isPopup
    ? null
    : !reference
      ? paymentDetailHref
      : isError
        ? paymentDetailHref
        : data
          ? isPaid
            ? "/welcome"
            : paymentDetailHref
          : null;

  const countdown = useRedirectCountdown(
    Boolean(redirectHref) && (!!data || isError || !reference),
    redirectHref,
    3,
  );

  if (!reference) {
    return (
      <StatusCard
        label="payment failed"
        tone="failed"
        countdown={countdown}
        showCountdown={!isPopup}
      />
    );
  }

  if (isLoading) {
    return <PaymentStatusSkeleton />;
  }

  if (isError) {
    return (
      <StatusCard
        label={
          error?.message?.toLowerCase().includes("pending")
            ? "payment pending"
            : "payment failed"
        }
        tone={
          error?.message?.toLowerCase().includes("pending")
            ? "pending"
            : "failed"
        }
        countdown={countdown}
        showCountdown={!isPopup}
      />
    );
  }

  if (data && isPaid) {
    return (
      <StatusCard
        label={paymentStatusLabel(data.paymentStatus)}
        tone="success"
        countdown={countdown}
        showCountdown={!isPopup}
      />
    );
  }

  if (data && !isPaid) {
    const label = paymentStatusLabel(data.paymentStatus);
    return (
      <StatusCard
        label={label}
        tone={data.paymentStatus === "failed" ? "failed" : "pending"}
        countdown={countdown}
        showCountdown={!isPopup}
      />
    );
  }

  return null;
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<PaymentStatusSkeleton />}>
      <PaymentVerifyContent />
    </Suspense>
  );
}

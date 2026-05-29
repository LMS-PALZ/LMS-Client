"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVerifyPayment } from "@ssu/queries";
import { studentPath } from "@/lib/studentRoutes";
import { Spinner } from "@ssu/ui";

function PaymentVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const { data, isLoading, isError, error } = useVerifyPayment(reference);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        router.replace(studentPath("/welcome"));
      }, 3000);
    }
  }, [data, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      {isLoading && (
        <>
          <Spinner className="h-8 w-8 animate-spin text-[#4E845F]" />
          <p className="text-[15px] text-[#6B7280]">
            Verifying your payment...
          </p>
        </>
      )}

      {data && (
        <>
          <div className="text-5xl">🎉</div>
          <h1 className="text-[22px] font-bold text-[#1D1D1D]">
            Payment Successful!
          </h1>
          <p className="text-[14px] text-[#6B7280]">
            {data.message ?? "Your payment has been confirmed."}
          </p>
          <p className="text-[13px] text-[#9CA3AF]">
            Redirecting you to welcomepage...
          </p>
        </>
      )}

      {isError && (
        <>
          <div className="text-5xl">❌</div>
          <h1 className="text-[22px] font-bold text-[#1D1D1D]">
            Payment Failed
          </h1>
          <p className="text-[14px] text-[#6B7280]">{error?.message}</p>
          <button
            type="button"
            onClick={() => router.replace(studentPath("/paymentdetail"))}
            className="mt-4 rounded-full bg-[#4E845F] px-6 py-2 text-[14px] text-white transition hover:opacity-80"
          >
            Try Again
          </button>
        </>
      )}
    </div>
  );
}

function PaymentVerifyFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Spinner className="h-8 w-8 animate-spin text-[#4E845F]" />
      <p className="text-[15px] text-[#6B7280]">Verifying your payment...</p>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense fallback={<PaymentVerifyFallback />}>
      <PaymentVerifyContent />
    </Suspense>
  );
}

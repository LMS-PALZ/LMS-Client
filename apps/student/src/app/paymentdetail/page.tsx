"use client";

import { readStoredPaymentReference, storePaymentReference } from "@ssu/api";
import {
  useInitializePaymentMutation,
  usePrograms,
  useVerifyPayment,
} from "@ssu/queries";
import { useSignupStore } from "@ssu/store";
import { Button, GoBack } from "@ssu/ui";
import { Mail, Phone, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ensureSignupSessionPersisted,
  formatSignupDisplayName,
  hasCompleteSignupSession,
  identityFromVerifyStudent,
  persistSignupSessionFromVerify,
  storePaymentResume,
  type SignupSessionIdentity,
} from "@/lib/signup-session";

const DEFAULT_PROGRAM_DETAILS = {
  duration: "6 months",
  applicationFee: 20000,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatCurrentDate() {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function PaymentDetailContent() {
  const payment = useInitializePaymentMutation();
  const searchParams = useSearchParams();
  const referenceFromUrl = searchParams.get("reference")?.trim() || null;
  const hasHydrated = useSignupStore((state) => state._hasHydrated);
  const setHasHydrated = useSignupStore((state) => state.setHasHydrated);
  const { data: programs } = usePrograms();
  const [localIdentity, setLocalIdentity] =
    useState<SignupSessionIdentity | null>(null);
  const [storedReference, setStoredReference] = useState<string | null>(null);

  useEffect(() => {
    const markHydrated = () => setHasHydrated(true);

    try {
      if (useSignupStore.persist?.hasHydrated?.()) {
        markHydrated();
        return undefined;
      }

      const unsub = useSignupStore.persist?.onFinishHydration?.(markHydrated);
      if (typeof unsub !== "function") {
        markHydrated();
        return undefined;
      }
      return unsub;
    } catch {
      markHydrated();
      return undefined;
    }
  }, [setHasHydrated]);

  useEffect(() => {
    setStoredReference(readStoredPaymentReference());
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    const local = ensureSignupSessionPersisted();
    if (local) setLocalIdentity(local);
  }, [hasHydrated]);

  const reference = referenceFromUrl || storedReference;
  const verify = useVerifyPayment(reference, { notify: false });

  // Persist verify student into local session whenever it arrives.
  useEffect(() => {
    if (!verify.data?.student) return;
    if (verify.data.reference) {
      storePaymentReference(verify.data.reference);
    }
    const restored = persistSignupSessionFromVerify(verify.data.student);
    if (restored) setLocalIdentity(restored);
  }, [verify.data]);

  // Prefer live verify payload for display — do not wait on store/effects.
  const identity =
    identityFromVerifyStudent(verify.data?.student) ?? localIdentity;

  const display = identity ?? {
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    program: "",
    program_title: "",
  };

  const fullName = formatSignupDisplayName(display);

  const matchedProgram = programs?.find((p) => p.slug === display.program);
  const applicationFee =
    matchedProgram?.priceAmount ??
    identity?.applicationFee ??
    DEFAULT_PROGRAM_DETAILS.applicationFee;

  const handlePayment = async () => {
    const latest =
      persistSignupSessionFromVerify(verify.data?.student) ??
      ensureSignupSessionPersisted() ??
      identity;
    if (!hasCompleteSignupSession(latest)) return;

    storePaymentResume(latest!);

    const callbackUrl = `${window.location.origin}/verifypayment`;

    const data = await payment.mutateAsync({
      email: latest!.email,
      program: latest!.program,
      callbackUrl,
    });

    storePaymentResume(latest!, data.reference);
    storePaymentReference(data.reference);
    window.location.href = data.checkout_url;
  };

  const canPay = hasCompleteSignupSession(identity);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white">
      <GoBack
        fallbackHref="/signup"
        className="absolute left-4 top-4 z-10 text-sm font-medium sm:left-8 sm:top-6"
      />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-6 text-center sm:py-8 lg:py-4">
        <div className="mb-4 w-[96px] sm:mb-5 sm:w-[110px] lg:mb-3 lg:w-[100px]">
          <img
            src="/firstlogo.png"
            alt="Chiggy Nsofor Foundation"
            loading="eager"
            className="h-auto w-full"
          />
        </div>

        <div className="mx-auto max-w-[320px]">
          <h1 className="mb-1.5 text-[22px] font-bold text-[#1F2937] sm:text-[23px] lg:mb-1">
            Confirm your payment
          </h1>

          <p className="mx-auto mb-5 max-w-[560px] text-sm leading-5 text-[#6B7280] lg:mb-4">
            Pay the application fee to continue. You&apos;ll set up your account
            after payment.
          </p>
        </div>

        <div className="w-full max-w-[560px] rounded-[28px] bg-[#F9FBFD] text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:rounded-[34px]">
          <div className="grid gap-5 px-6 py-6 sm:gap-6 sm:px-8 sm:py-7 lg:grid-cols-[1fr_0.95fr] lg:gap-0 lg:px-0 lg:py-0">
            <div className="space-y-4 lg:space-y-5 lg:px-7 lg:py-6">
              <div className="flex items-center gap-3 text-[#374151]">
                <User className="h-5 w-5 shrink-0 text-[#64748B]" />
                <p className="font-medium sm:text-[15px]">
                  {fullName || "Your Name"}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[#374151]">
                <Mail className="h-5 w-5 shrink-0 text-[#64748B]" />
                <p className="break-all font-medium sm:text-[15px]">
                  {display.email || "your@email.com"}
                </p>
              </div>

              <div className="flex items-center gap-3 text-[#374151]">
                <Phone className="h-5 w-5 shrink-0 text-[#64748B]" />
                <p className="font-medium sm:text-[15px]">
                  {display.phone_number || "0700 000 0000"}
                </p>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-5 lg:border-l lg:border-t-0 lg:px-8 lg:py-6 lg:pt-6">
              <div className="space-y-4 lg:space-y-4">
                <div>
                  <h2 className="mb-1 font-medium text-[#374151] sm:text-[15px]">
                    Selected Program
                  </h2>
                  <p className="text-sm text-[#6B7280] sm:text-[15px]">
                    {display.program_title ||
                      matchedProgram?.title ||
                      "Selected program will appear here"}
                  </p>
                </div>

                <div>
                  <h2 className="mb-1 font-medium text-[#374151] sm:text-[15px]">
                    Duration
                  </h2>
                  <p className="text-sm text-[#6B7280] sm:text-[15px]">
                    {DEFAULT_PROGRAM_DETAILS.duration}
                  </p>
                </div>

                <div>
                  <h2 className="mb-1 font-medium text-[#374151] sm:text-[15px]">
                    Start Date
                  </h2>
                  <p className="text-sm text-[#6B7280] sm:text-[15px]">
                    {formatCurrentDate()}
                  </p>
                </div>

                <div>
                  <h2 className="mb-1 font-medium text-[#374151] sm:text-[15px]">
                    Application fee
                  </h2>
                  <p className="font-semibold text-[#2F6F45] sm:text-[15px]">
                    {formatCurrency(applicationFee)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handlePayment}
          loading={payment.isPending}
          disabled={payment.isPending || !canPay}
          variant="primary"
          className="mt-5 w-[200px] rounded-[30px] text-[var(--color-surface)] lg:mt-4"
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PaymentDetailContent />
    </Suspense>
  );
}

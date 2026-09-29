"use client";

import { storePaymentReference } from "@ssu/api";
import {
  mutationToast,
  useInitializePaymentMutation,
  usePrograms,
} from "@ssu/queries";
import { useSignupStore } from "@ssu/store";
import { Button, GoBack } from "@ssu/ui";
import { Mail, Phone, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  isPaymentCheckoutMessage,
  openPaymentCheckoutPopup,
} from "@/lib/payment-checkout";
import {
  PAYMENT_RESUME_QUERY,
  applySignupResumeToken,
  buildPaymentVerifyCallbackUrl,
  encodeSignupResume,
  ensureSignupSessionPersisted,
  formatSignupDisplayName,
  hasCompleteSignupSession,
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
  const router = useRouter();
  const payment = useInitializePaymentMutation();
  const searchParams = useSearchParams();
  const resumeToken = searchParams.get(PAYMENT_RESUME_QUERY);
  const hasHydrated = useSignupStore((state) => state._hasHydrated);
  const setHasHydrated = useSignupStore((state) => state.setHasHydrated);
  const userEmail = useSignupStore((state) => state.user?.email);
  const userFirstName = useSignupStore((state) => state.user?.first_name);
  const userLastName = useSignupStore((state) => state.user?.last_name);
  const userPhone = useSignupStore((state) => state.user?.phone_number);
  const userProgram = useSignupStore((state) => state.user?.program);
  const { data: programs } = usePrograms();
  const [identity, setIdentity] = useState<SignupSessionIdentity | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const checkoutCleanupRef = useRef<(() => void) | null>(null);
  const checkoutFinishedRef = useRef(false);

  useEffect(() => {
    return () => {
      checkoutCleanupRef.current?.();
    };
  }, []);

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
    if (resumeToken) {
      setIdentity(applySignupResumeToken(resumeToken));
      return;
    }
    if (!hasHydrated) return;
    setIdentity(ensureSignupSessionPersisted());
  }, [
    hasHydrated,
    resumeToken,
    userEmail,
    userFirstName,
    userLastName,
    userPhone,
    userProgram,
  ]);

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
    const latest = ensureSignupSessionPersisted();
    if (!hasCompleteSignupSession(latest)) return;

    // Keep React state even if storage is wiped during the gateway round-trip.
    setIdentity(latest);
    storePaymentResume(latest!);

    const resume = encodeSignupResume(latest!);
    const callbackUrl = buildPaymentVerifyCallbackUrl(
      window.location.origin,
      latest!,
    );

    const data = await payment.mutateAsync({
      email: latest!.email,
      program: latest!.program,
      callbackUrl,
      resume,
    });

    storePaymentResume(latest!, data.reference);
    storePaymentReference(data.reference);

    checkoutCleanupRef.current?.();

    const popup = openPaymentCheckoutPopup(data.checkout_url);
    if (!popup) {
      // Popup blocked — fall back to full-page redirect.
      window.location.href = data.checkout_url;
      return;
    }

    setCheckoutOpen(true);
    checkoutFinishedRef.current = false;

    const finish = (paid: boolean) => {
      if (checkoutFinishedRef.current) return;
      checkoutFinishedRef.current = true;
      checkoutCleanupRef.current?.();
      checkoutCleanupRef.current = null;
      setCheckoutOpen(false);
      setIdentity(ensureSignupSessionPersisted() ?? latest);

      if (paid) {
        router.replace("/welcome");
        return;
      }

      mutationToast.info(
        "Payment not completed yet. You can try again when ready.",
      );
    };

    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (!isPaymentCheckoutMessage(event.data)) return;
      finish(event.data.paid);
    };

    const pollClosed = window.setInterval(() => {
      if (!popup.closed) return;
      finish(false);
    }, 800);

    checkoutCleanupRef.current = () => {
      window.removeEventListener("message", onMessage);
      window.clearInterval(pollClosed);
    };

    window.addEventListener("message", onMessage);
  };

  const canPay = hasCompleteSignupSession(identity);

  return (
    <div className="relative min-h-screen w-full bg-white">
      <GoBack
        fallbackHref="/signup"
        className="absolute left-6 top-12 text-sm font-medium sm:left-16 sm:top-20"
      />

      <div className="flex flex-col items-center justify-center bg-[#FFFFFF] px-4 py-10 text-center sm:py-14">
        <div className="mb-8 w-[120px] sm:mb-12">
          <img
            src="/firstlogo.png"
            alt="Chiggy Nsofor Foundation"
            loading="eager"
          />
        </div>

        <div className="mx-auto max-w-[300px]">
          <h1 className="mb-3 text-[24px] font-bold text-[#1F2937] sm:text-[23px]">
            Confirm your payment
          </h1>

          <p className="mx-auto mb-8 max-w-[560px] text-sm text-[#6B7280]">
            Pay the application fee to continue. You&apos;ll set up your account
            after payment.
          </p>
        </div>

        <div className="max-w-100 rounded-[34px] bg-[#F9FBFD] text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:w-[600px]">
          <div className="grid gap-8 px-8 py-10 sm:px-10 lg:grid-cols-[1fr_0.95fr] lg:gap-0 lg:px-0 lg:py-0">
            <div className="space-y-7 lg:px-8 lg:py-10">
              <div className="flex items-center gap-4 text-[#374151]">
                <User className="h-5 w-5 text-[#64748B]" />
                <p className="font-medium sm:text-[15px]">
                  {fullName || "Your Name"}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[#374151]">
                <Mail className="h-5 w-5 text-[#64748B]" />
                <p className="font-medium leading-8 sm:text-[15px]">
                  {display.email || "your@email.com"}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[#374151]">
                <Phone className="h-5 w-5 text-[#64748B]" />
                <p className="font-medium leading-8 sm:text-[15px]">
                  {display.phone_number || "0700 000 0000"}
                </p>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-8 lg:border-l lg:border-t-0 lg:px-12 lg:py-10">
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 font-medium text-[#374151] sm:text-[17px]">
                    Selected Program
                  </h2>
                  <p className="text-sm text-[#6B7280] sm:text-[16px]">
                    {display.program_title ||
                      matchedProgram?.title ||
                      "Selected program will appear here"}
                  </p>
                </div>

                <div>
                  <h2 className="mb-2 font-medium text-[#374151] sm:text-[17px]">
                    Duration
                  </h2>
                  <p className="text-[#6B7280] sm:text-[16px]">
                    {DEFAULT_PROGRAM_DETAILS.duration}
                  </p>
                </div>

                <div>
                  <h2 className="mb-2 font-medium text-[#374151] sm:text-[17px]">
                    Start Date
                  </h2>
                  <p className="text-[#6B7280] sm:text-[16px]">
                    {formatCurrentDate()}
                  </p>
                </div>

                <div>
                  <h2 className="mb-2 font-medium text-[#374151] sm:text-[17px]">
                    Application fee
                  </h2>
                  <p className="font-semibold leading-8 text-[#2F6F45] sm:text-[16px]">
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
          loading={payment.isPending || checkoutOpen}
          disabled={payment.isPending || checkoutOpen || !canPay}
          variant="primary"
          className="mt-8 w-[200px] rounded-[30px] text-[var(--color-surface)]"
        >
          {checkoutOpen ? "Complete payment…" : "Proceed to Payment"}
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

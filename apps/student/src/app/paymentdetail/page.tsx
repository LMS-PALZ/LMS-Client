"use client";

import { Button, Spinner } from "@ssu/ui";
import { Mail, Phone, User, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { getProgramOptionByName } from "@/lib/program-options";
import { useSignupStore } from "@ssu/store";
import { AlertBanner } from "@ssu/ui";
import { useInitializePaymentMutation } from "@ssu/queries";

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

export default function Page() {
  const router = useRouter();

  const payment = useInitializePaymentMutation();
  const user = useSignupStore((state) => state.user);

  const handlePayment = async () => {
    const res = await payment.mutateAsync({
      email: user?.email ?? "",
      program: user?.program ?? "",
    });

    localStorage.setItem("payment_reference", res.reference);

    window.location.href = res.checkout_url;
  };

  const selectedProgram = getProgramOptionByName(user?.program || "");

  return (
    <div className="relative min-h-screen w-full bg-white">
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-12 flex items-center gap-2 text-[#2F6F45] transition hover:opacity-80 sm:left-16 sm:top-20"
      >
        <ChevronLeft className="h-5 w-5" />
        <span className="text-sm font-medium">Back</span>
      </button>

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
            Pay the application fee to continue. You’ll set up your account
            after payment.
          </p>
        </div>

        {payment.isError && (
          <AlertBanner variant="error">{payment.error?.message}</AlertBanner>
        )}

        <div className="max-w-100 rounded-[34px] bg-[#F9FBFD] text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:w-[600px]">
          <div className="grid gap-8 px-8 py-10 sm:px-10 lg:grid-cols-[1fr_0.95fr] lg:gap-0 lg:px-0 lg:py-0">
            <div className="space-y-7 lg:px-8 lg:py-10">
              <div className="flex items-center gap-4 text-[#374151]">
                <User className="h-5 w-5 text-[#64748B]" />

                <p className="font-medium sm:text-[15px]">
                  {user ? `${user.first_name} ${user.last_name}` : "Your Name"}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[#374151]">
                <Mail className="h-5 w-5 text-[#64748B]" />

                <p className="font-medium leading-8 sm:text-[15px]">
                  {user?.email || "your@email.com"}
                </p>
              </div>

              <div className="flex items-center gap-4 text-[#374151]">
                <Phone className="h-5 w-5 text-[#64748B]" />

                <p className="font-medium leading-8 sm:text-[15px]">
                  {user?.phone_number || "0700 000 0000"}
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
                    {user?.program_title || "Selected program will appear here"}
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
                    {formatCurrency(
                      selectedProgram?.fee ??
                        DEFAULT_PROGRAM_DETAILS.applicationFee,
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button
          type="button"
          onClick={handlePayment}
          disabled={payment.isPending}
          variant="primary"
          // size="lg"
          className="w-[200px] rounded-[30px] text-[var(--color-surface)]"
        >
          {payment.isPending ? (
            <Spinner className="h-5 w-5 animate-spin" />
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </div>
    </div>
  );
}

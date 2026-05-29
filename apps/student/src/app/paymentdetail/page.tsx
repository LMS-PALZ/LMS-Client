"use client";

import { Button } from "@ssu/ui";
import { Mail, Phone, User, ChevronLeft } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  readStudentSignupDetails,
  type StudentSignupDetails,
} from "@/lib/signup-details";
const DEFAULT_PROGRAM_DETAILS = {
  duration: "6 months",
  startDate: "June 5th, 2026",
  applicationFee: 20000,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Page() {
  const router = useRouter();
  const [signupDetails, setSignupDetails] =
    useState<StudentSignupDetails | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setSignupDetails(readStudentSignupDetails());
    setIsHydrated(true);
  }, []);

  const fullName = useMemo(() => {
    if (!signupDetails) {
      return "Your name will appear here";
    }

    return `${signupDetails.firstName} ${signupDetails.lastName}`.trim();
  }, [signupDetails]);

  const selectedCourse =
    signupDetails?.programName ?? signupDetails?.program ?? "Selected program";
  const applicationFee =
    signupDetails?.applicationFee ?? DEFAULT_PROGRAM_DETAILS.applicationFee;
  const email = signupDetails?.email || "your@email.com";
  const phoneNumber = signupDetails?.phoneNumber || "0700 000 0000";

  if (!isHydrated) {
    return null;
  }

  return (
    <div className="w-full min-h-screen bg-white relative">
      <button
        onClick={() => router.back()}
        className="absolute sm:top-20 sm:left-16 top-12 left-6 flex items-center gap-2 text-[#2F6F45] hover:opacity-80 transition"
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
          <h1 className="mb-3 text-sm font-bold  text-[#1F2937] sm:text-[23px]">
            Confirm your payment
          </h1>
          <p className="mx-auto mb-8 max-w-[560px] text-sm  text-[#6B7280]">
            Pay the application fee to continue. You’ll set up your account
            after payment.
          </p>
        </div>

        <div className="sm:w-[600px] max-w-100 md-50 rounded-[34px] bg-[#F9FBFD] text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="grid gap-8 px-8 py-10 sm:px-10 lg:grid-cols-[1fr_0.95fr] lg:gap-0 lg:px-0 lg:py-0">
            <div className="space-y-7 lg:px-8 lg:py-10">
              <div className="flex items-center gap-4 text-[#374151]">
                <User className="h-5 w-5 text-[#64748B]" />
                <p className="font-medium  sm:text-[15px]">{fullName}</p>
              </div>

              <div className="flex items-center gap-4 text-[#374151]">
                <Mail className="h-5 w-5 text-[#64748B]" />
                <p className="font-medium leading-8 sm:text-[15px]">{email}</p>
              </div>

              <div className="flex items-center gap-4 text-[#374151]">
                <Phone className="h-5 w-5 text-[#64748B]" />
                <p className="font-medium leading-8 sm:text-[15px]">
                  {phoneNumber}
                </p>
              </div>
            </div>

            <div className="border-t border-[#E2E8F0] pt-8 lg:border-l lg:border-t-0 lg:px-12 lg:py-10">
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 font-medium text-[#374151] sm:text-[17px]">
                    Selected Program
                  </h2>
                  <p className="text-[#6B7280] text-sm sm:text-[16px]">
                    {selectedCourse}
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
                    {DEFAULT_PROGRAM_DETAILS.startDate}
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
          variant="primary"
          size="lg"
          className="mt-10 min-w-[280px] rounded-full px-10 text-lg text-[var(--color-surface)]"
          onClick={() => router.push("/welcome")}
        >
          Continue to payment
        </Button>
      </div>
    </div>
  );
}

"use client";

import { AuthLayout, Button } from "@ssu/ui";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PasswordChangedPage() {
  const router = useRouter();

  return (
    <AuthLayout className="bg-[#F5F5F5]">
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-[420px] text-center">
          <div className="mb-10 flex justify-center">
            <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border-2 border-[#94D2A1] bg-[#EBF8ED]">
              <Check className="h-10 w-10 text-[#29A745]" strokeWidth={3} />
            </div>
          </div>

          <h1 className="text-sm text-[24px] font-bold text-[#1F2937] mb-3 sm:text-[23px]">
            Password Changed
          </h1>

          <p className="mb-14 text-sm text-[#6B7280]">
            Your password has been changed successfully
          </p>

          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={() => router.push("/login")}
            className="w-full rounded-[30px] text-[var(--color-surface)] hover:bg-[#456F4D]"
          >
            Login
          </Button>
        </div>
      </div>
    </AuthLayout>
  );
}

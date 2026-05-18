"use client";

import { useConfirmCodeMutation, useResendCodeMutation } from "@ssu/queries";
import { AlertBanner, AuthLayout, Button, Input } from "@ssu/ui";
import { Spinner } from "@ssu/ui";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
} from "react";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 59;

export default function Page() {
  const router = useRouter();
  const confirmCode = useConfirmCodeMutation();
  const resendCode = useResendCodeMutation();
  const [code, setCode] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [banner, setBanner] = useState<{
    variant: "error" | "success";
    message: string;
  } | null>(null);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("user-email");
    setUserEmail(email);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timeout);
  }, [secondsLeft]);

  const isComplete = code.every((digit) => digit !== "");

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode((current) => {
      const next = [...current];
      next[index] = digit;
      return next;
    });

    if (digit && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH)
      .split("");

    if (pastedDigits.length === 0) {
      return;
    }

    setCode((current) => {
      const next = [...current];
      pastedDigits.forEach((digit, index) => {
        next[index] = digit;
      });
      return next;
    });

    const focusIndex = Math.min(pastedDigits.length, CODE_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBanner(null);

    try {
      const confirmationCode = code.join("");
      const res = await confirmCode.mutateAsync({ code: confirmationCode });

      if (res.ok) {
        setBanner({
          variant: "success",
          message: "Email verified successfully!",
        });
        setTimeout(() => {
          localStorage.removeItem("user-email");
          router.replace("/paymentdetail");
        }, 2000);
        return;
      }

      setBanner({ variant: "error", message: res.message });
    } catch (error: any) {
      setBanner({
        variant: "error",
        message: error?.message || "Failed to verify code. Please try again.",
      });
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) {
      return;
    }

    setBanner(null);

    try {
      const res = await resendCode.mutateAsync();

      if (res.ok) {
        setBanner({
          variant: "success",
          message: res.message || "Code resent successfully!",
        });
        setCode(Array(CODE_LENGTH).fill(""));
        setSecondsLeft(RESEND_SECONDS);
        inputRefs.current[0]?.focus();
        return;
      }

      setBanner({ variant: "error", message: res.message });
    } catch (error: any) {
      setBanner({
        variant: "error",
        message: error?.message || "Failed to resend code. Please try again.",
      });
    }
  };

  return (
    <AuthLayout className="bg-white">
      <div className="flex flex-col items-center pt-12 text-center">
        <div className="mb-10 w-[120px] sm:mb-12">
          <img
            src="/firstlogo.png"
            alt="Chiggy Nsofor Foundation"
            loading="eager"
          />
        </div>

        <div className="w-full max-w-[512px]">
          <h1 className="mb-3 font-bold text-[26px]  text-[#1F2937] sm:text-[23px]">
            Check your email
          </h1>
          <p className="mx-auto mb-8 max-w-[560px] text-sm  text-[#6B7280]">
            We sent a 6-digit code to {userEmail || "your email"}. Enter it
            below to confirm your account.
          </p>

          {banner && (
            <div className="mb-6">
              <AlertBanner variant={banner.variant}>
                {banner.message}
              </AlertBanner>
            </div>
          )}

          <form className="w-full" onSubmit={handleSubmit}>
            <div className="mb-12 flex items-center justify-center gap-3 sm:gap-4">
              {code.map((digit, index) => (
                <Input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element;
                  }}
                  value={digit}
                  onChange={(event) => handleChange(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  onPaste={handlePaste}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={1}
                  aria-label={`Confirmation code digit ${index + 1}`}
                  filled={digit !== ""}
                  disabled={confirmCode.isPending}
                  className={`h-[50px] w-[50px] rounded-[15px] px-0 text-center text-[22px] font-semibold text-[#374151] shadow-none focus-visible:ring-1 sm:h-[50px] sm:w-[50px] transition-all duration-200 ${
                    digit !== "" ? "border-[#4C7D5B]" : "border-[#D7DFEC]"
                  }`}
                />
              ))}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isComplete || confirmCode.isPending}
              className="min-w-full rounded-full py-7 text-lg text-[var(--color-surface)]"
            >
              {confirmCode.isPending ? "Verifying..." : "Continue"}

              {confirmCode.isPending ? (
                <Spinner className="h-5 w-5 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          <p className="mt-10 mb-10  text-[#4B5563] text-sm ">
            Didn&apos;t get it?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0 || resendCode.isPending}
              className="font-semibold text-[#2F6F45] disabled:cursor-default disabled:opacity-100"
            >
              {secondsLeft > 0
                ? `Resend code in 0:${secondsLeft.toString().padStart(2, "0")}`
                : resendCode.isPending
                  ? "Sending..."
                  : "Resend code"}
            </button>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

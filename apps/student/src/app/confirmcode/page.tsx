"use client";

import { useConfirmCodeMutation, useResendCodeMutation } from "@ssu/queries";
import { useSignupStore } from "@ssu/store";
import { AlertBanner, AuthLayout, Button, Input, Spinner } from "@ssu/ui";
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

  const userEmail = useSignupStore((state) => state.user?.email);

  const [code, setCode] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));

  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  const [banner, setBanner] = useState<{
    variant: "error" | "success";
    message: string;
  } | null>(null);

  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const isComplete = code.every((digit) => digit !== "");

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timeout = window.setTimeout(() => {
      setSecondsLeft((c) => Math.max(0, c - 1));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [secondsLeft]);

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);

    setCode((prev) => {
      const next = [...prev];
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
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, CODE_LENGTH)
      .split("");

    if (!pasted.length) return;

    setCode((prev) => {
      const next = [...prev];
      pasted.forEach((d, i) => (next[i] = d));
      return next;
    });

    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBanner(null);

    try {
      const confirmationCode = code.join("");

      const res = await confirmCode.mutateAsync({
        code: confirmationCode,
      });

      if (res.ok) {
        setBanner({
          variant: "success",
          message: "Email verified successfully!",
        });

        setTimeout(() => {
          router.replace("/paymentdetail");
        }, 2000);

        return;
      }

      setBanner({
        variant: "error",
        message: res.message,
      });
    } catch (err: any) {
      setBanner({
        variant: "error",
        message: err?.message || "Verification failed",
      });
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0) return;

    setBanner(null);

    try {
      const res = await resendCode.mutateAsync();

      if (res.ok) {
        setBanner({
          variant: "success",
          message: res.message,
        });

        setCode(Array(CODE_LENGTH).fill(""));
        setSecondsLeft(RESEND_SECONDS);

        inputRefs.current[0]?.focus();
        return;
      }

      setBanner({
        variant: "error",
        message: res.message,
      });
    } catch (err: any) {
      setBanner({
        variant: "error",
        message: err?.message || "Resend failed",
      });
    }
  };

  return (
    <AuthLayout className="bg-white">
      <div className="flex flex-col items-center pt-12 text-center">
        <div className="mb-10 w-[120px]">
          <img src="/firstlogo.png" alt="logo" />
        </div>

        <div className="w-full max-w-[512px]">
          <h1 className="text-[24px] font-bold text-[#1F2937] mb-3 sm:text-[23px]">
            Check your email
          </h1>

          <p className="mb-8 text-sm text-[#6B7280]">
            We sent a code to {userEmail || "your email"}
          </p>

          {banner && (
            <div className="mb-6">
              <AlertBanner variant={banner.variant}>
                {banner.message}
              </AlertBanner>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-10 flex justify-center gap-4 sm:gap-5">
              {code.map((digit, i) => (
                <Input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  maxLength={1}
                  disabled={confirmCode.isPending}
                  className={`h-[40px] w-[40px] sm:h-[50px] sm:w-[50px] text-center text-lg sm:text-xl rounded-[12px] ${
                    digit ? "border-2 border-[#0D6939]" : ""
                  }`}
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={!isComplete || confirmCode.isPending}
              variant="primary"
              size="lg"
              className="min-w-full rounded-full py-6 text-lg text-[var(--color-surface)]"
            >
              {confirmCode.isPending ? (
                <Spinner className="h-5 w-5 animate-spin" />
              ) : (
                "Continue"
              )}
            </Button>
          </form>
          <p className="mt-10 mb-10 text-[#4B5563] text-sm ">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={secondsLeft > 0 || resendCode.isPending}
              className="mt-6 text-sm text-green-700"
            >
              {secondsLeft > 0
                ? `Resend in 0:${secondsLeft.toString().padStart(2, "0")}`
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

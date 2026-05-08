"use client";

import { AuthLayout, Button, Input } from "@ssu/ui";
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from "react";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 59;

export default function Page() {
    const [code, setCode] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
    const [countDown, setCountDown] = useState(RESEND_SECONDS);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (countDown === 0) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setCountDown((current) => Math.max(0, current - 1));
        }, 1000);

        return () => window.clearTimeout(timeout);
    }, [setCountDown]);

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

    const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
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

    const handleResend = () => {
        if (countDown > 0) {
            return;
        }

        setCode(Array(CODE_LENGTH).fill(""));
        setCountDown(RESEND_SECONDS);
        inputRefs.current[0]?.focus();
    };

    return (
        <AuthLayout className="bg-white">
            <div className="flex flex-col items-center pt-12 text-center">
                <div className="mb-10 w-[120px] sm:mb-12">
                    <img src="/firstlogo.png" alt="Chiggy Nsofor Foundation" loading="eager" />
                </div>

                <div className="w-full max-w-[512px]">
                    <h1 className="mb-3 text-sm font-bold  text-[#1F2937] sm:text-[23px]">
                        Check your email
                    </h1>
                    <p className="mx-auto mb-8 max-w-[560px] text-sm  text-[#6B7280]">
                        We sent a 6-digit code to [user@email.com]. Enter it below to confirm your account.
                    </p>

                    <form className="w-full" onSubmit={(event) => event.preventDefault()}>
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
                                    className="h-[50px] w-[50px] rounded-[15px] border-[#D7DFEC] px-0 text-center text-[22px] font-semibold text-[#374151] shadow-none focus-visible:ring-1 sm:h-[50px] sm:w-[50px]"
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={!isComplete}
                            className="min-w-full rounded-full py-7 text-lg text-[var(--color-surface)]"
                        >
                            Continue
                        </Button>
                    </form>

                    <p className="mt-10 mb-10  text-[#4B5563] text-sm ">
                        Didn&apos;t get it?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={countDown > 0}
                            className="font-semibold text-[#2F6F45] disabled:cursor-default disabled:opacity-100"
                        >
                            {secondsLeft > 0
                                ? `Resend code in 0:${countDown.toString().padStart(2, "0")}`
                                : "Resend code"}
                        </button>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}

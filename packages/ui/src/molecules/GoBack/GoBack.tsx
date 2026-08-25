"use client";

import { cn } from "@ssu/utils";
import { ChevronLeft } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";
import { useGoBack } from "./useGoBack";

export interface GoBackProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  fallbackHref?: string;
  iconOnly?: boolean;
}

export function GoBack({
  label = "Go back",
  fallbackHref,
  iconOnly = false,
  className,
  onClick,
  type = "button",
  ...props
}: GoBackProps) {
  const goBack = useGoBack(fallbackHref);

  return (
    <button
      type={type}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          goBack();
        }
      }}
      className={cn(
        iconOnly
          ? "inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-button)] text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
          : "inline-flex items-center gap-2 text-[15px] font-bold text-brand-green transition hover:opacity-80",
        className,
      )}
      aria-label={iconOnly ? label : undefined}
      {...props}
    >
      <ChevronLeft className="h-5 w-5 shrink-0" aria-hidden />
      {!iconOnly ? <span>{label}</span> : null}
    </button>
  );
}

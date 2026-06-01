import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
  /** Top-align content so full forms fit on one screen (e.g. signup). */
  contentAlign?: "center" | "top";
}

export function AuthLayout({
  children,
  className,
  contentAlign = "center",
}: AuthLayoutProps) {
  const isTop = contentAlign === "top";

  return (
    <div
      className={cn(
        "min-h-screen w-full flex justify-center bg-[#FFFFFF]",
        className,
      )}
    >
      <div
        className={cn(
          "flex min-h-screen w-full justify-center bg-transparent",
          isTop
            ? "items-start px-6 pb-8 pt-5 sm:px-8 sm:pt-6"
            : "items-center p-8 pb-16",
        )}
      >
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}

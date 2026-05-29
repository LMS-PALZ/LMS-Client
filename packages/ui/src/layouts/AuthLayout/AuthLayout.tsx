import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen w-full flex justify-center bg-[#FFFFFF]",
        className,
      )}
    >
      <div className="flex min-h-screen w-full items-center justify-center p-8 pb-16 bg-transparent">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}

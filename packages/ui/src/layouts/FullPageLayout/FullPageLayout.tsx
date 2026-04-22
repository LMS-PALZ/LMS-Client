import { cn } from "@ssu/utils";
import type { ReactNode } from "react";

export interface FullPageLayoutProps {
  header: ReactNode;
  children: ReactNode;
  className?: string;
}

export function FullPageLayout({
  header,
  children,
  className,
}: FullPageLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col bg-neutral-50", className)}>
      <header className="flex h-14 shrink-0 items-center border-b bg-white px-4">
        {header}
      </header>
      <div className="flex flex-1 flex-col lg:flex-row">{children}</div>
    </div>
  );
}

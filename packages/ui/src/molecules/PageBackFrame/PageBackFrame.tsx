"use client";

import { cn } from "@ssu/utils";
import type { ReactNode } from "react";
import { GoBack } from "../GoBack";

export interface PageBackFrameProps {
  children: ReactNode;
  /** Used when there is no browser history to go back to. */
  fallbackHref?: string;
  label?: string;
  className?: string;
}

/** Top back control for inner / empty-state pages (student + admin). */
export function PageBackFrame({
  children,
  fallbackHref,
  label = "Go back",
  className,
}: PageBackFrameProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <GoBack fallbackHref={fallbackHref} label={label} />
      {children}
    </section>
  );
}

"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            "rounded-xl border border-neutral-200 bg-white text-neutral-900 shadow-card",
          title: "text-sm font-semibold",
          description: "text-sm text-neutral-600",
          actionButton: "bg-brand-green text-white",
          cancelButton: "bg-neutral-100 text-neutral-700",
          closeButton: "border-neutral-200 bg-white text-neutral-500",
        },
      }}
    />
  );
}

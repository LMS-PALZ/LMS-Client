"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useGoBack(fallbackHref?: string) {
  const router = useRouter();

  return useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    if (fallbackHref) {
      router.push(fallbackHref);
    }
  }, [router, fallbackHref]);
}

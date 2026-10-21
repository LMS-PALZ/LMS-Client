"use client";

import { AppStatusPage } from "@ssu/ui";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppStatusPage
      title="Something went wrong"
      description="Try again, or go back home."
      homeHref="/home"
      onRetry={reset}
    />
  );
}

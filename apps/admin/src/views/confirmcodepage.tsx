"use client";

import { ConfirmCodeForm } from "@ssu/ui";
import { useForgetEmailStore } from "@ssu/store";

export function ConfirmCodePage() {
  const userEmail = useForgetEmailStore(
    (state) => state.user?.forgotPasswordEmail,
  );
  return (
    <ConfirmCodeForm email={userEmail} onSuccessRedirect="/resetpassword" />
  );
}

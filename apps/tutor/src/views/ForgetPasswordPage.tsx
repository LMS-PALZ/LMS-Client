"use client";

import { ForgotPasswordForm } from "@ssu/ui";

export function ForgetPasswordPage() {
  return (
    <ForgotPasswordForm
      role="trainer"
      onSuccessRedirect="/resetpassword"
      showLoginLink={true}
    />
  );
}

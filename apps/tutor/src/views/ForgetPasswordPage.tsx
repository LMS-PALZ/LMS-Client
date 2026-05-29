"use client";

import { ForgotPasswordForm } from "@ssu/ui";

export function ForgetPasswordPage() {
  return (
    <ForgotPasswordForm
      onSuccessRedirect="/resetpassword"
      showLoginLink={true}
    />
  );
}

"use client";

import { adminPath } from "@ssu/config/portal-paths";
import { LoginForm } from "@ssu/ui";

export function LoginPage() {
  return (
    <LoginForm
      role="admin"
      onSuccessRedirect={adminPath()}
      title="Admin sign in"
      description="Sign in to continue to the admin console."
      showSignupLink={false}
    />
  );
}

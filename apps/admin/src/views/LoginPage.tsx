"use client";

import { LoginForm } from "@ssu/ui";

export function LoginPage() {
  return (
    <LoginForm
      role="admin"
      onSuccessRedirect="/"
      title="Admin sign in"
      description="Sign in to continue to the admin console."
      showSignupLink={false}
    />
  );
}

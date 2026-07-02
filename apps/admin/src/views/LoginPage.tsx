"use client";

import { adminPath } from "@ssu/config/portal-paths";
import { LoginForm } from "@ssu/ui";
import { recordAuditEvent } from "@/lib/audit-log";

export function LoginPage() {
  return (
    <LoginForm
      role="admin"
      onSuccessRedirect={adminPath()}
      title="Admin sign in"
      description="Sign in to continue to the admin console."
      showSignupLink={false}
      onLoginSuccess={(user) => {
        void recordAuditEvent("sign_in", user);
      }}
    />
  );
}

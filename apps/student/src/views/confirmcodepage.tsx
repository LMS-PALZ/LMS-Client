"use client";

import { ConfirmCodeForm } from "@ssu/ui";
import { useForgetEmailStore, useSignupStore } from "@ssu/store";
import { useSearchParams } from "next/navigation";

export function ConfirmCodePage() {
  const searchParams = useSearchParams();

  const from = searchParams.get("from");

  const signupEmail = useSignupStore((state) => state.user?.email);

  const forgotPasswordEmail = useForgetEmailStore(
    (state) => state.user?.forgotPasswordEmail,
  );

  const email = from === "forgetpassword" ? forgotPasswordEmail : signupEmail;

  const redirect =
    from === "forgetpassword" ? "/resetpassword" : "/paymentdetail";

  return <ConfirmCodeForm email={email} onSuccessRedirect={redirect} />;
}

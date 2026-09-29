"use client";

import { mutationToast } from "@ssu/queries";
import { ForgotPasswordForm } from "@ssu/ui";
import {
  readStudentSignupDetails,
  writeStudentSignupDetails,
} from "@/lib/signup-details";

export function ForgetPasswordPage() {
  return (
    <ForgotPasswordForm
      paymentRequiredPath="/paymentdetail"
      onPaymentRequired={(email) => {
        const existing = readStudentSignupDetails();
        writeStudentSignupDetails({
          first_name: existing?.first_name ?? "",
          last_name: existing?.last_name ?? "",
          email: email.trim().toLowerCase(),
          phone_number: existing?.phone_number ?? "",
          program: existing?.program ?? "",
          programName: existing?.programName,
          applicationFee: existing?.applicationFee,
        });
        mutationToast.info(
          "Complete your payment to finish registration, then you can set a password.",
        );
      }}
    />
  );
}

import type { SignUpFormValues } from "@ssu/schema";

export interface RegisterStudentRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  program: string;
}

export function toRegisterStudentRequest(
  input: SignUpFormValues,
): RegisterStudentRequest {
  return {
    first_name: input.first_name.trim(),
    last_name: input.last_name.trim(),
    email: input.email.trim().toLowerCase(),
    phone_number: input.phone_number.trim(),
    program: input.program,
  };
}

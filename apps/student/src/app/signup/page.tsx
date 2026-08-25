import { createStudentSignupMetadata } from "@ssu/config/site-metadata";
import { SignupPage } from "@/views/SignupPage";

export const metadata = createStudentSignupMetadata();

export default function Page() {
  return <SignupPage />;
}

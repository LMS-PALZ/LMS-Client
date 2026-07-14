import { AcceptInviteForm } from "@ssu/ui";

export default async function page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token = "", email = "" } = await searchParams;

  return (
    <AcceptInviteForm
      token={token}
      email={email}
      description="Please complete the form below to create your account as an admin"
      onSuccessRedirect="/login"
    />
  );
}

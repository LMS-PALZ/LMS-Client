import { AcceptInviteForm } from "@ssu/ui";

export default async function page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <AcceptInviteForm
      token={token}
      description="Please complete the form below to create your account as an admin"
      onSuccessRedirect="/login"
    />
  );
}

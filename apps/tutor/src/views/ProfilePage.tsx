"use client";

import { useSession } from "@ssu/queries";
import { Button, FormField, Input, PageHeader } from "@ssu/ui";

export function ProfilePage() {
  const { data: user } = useSession();
  return (
    <div className="space-y-6 max-w-lg">
      <PageHeader
        title="Profile"
        breadcrumbs={[{ label: "Tutor" }, { label: "Profile" }]}
      />
      <div className="rounded-xl border bg-white p-6 shadow-card space-y-4">
        <FormField id="fn" label="First name">
          <Input id="fn" defaultValue={user?.firstName} readOnly />
        </FormField>
        <FormField id="em" label="Email">
          <Input id="em" type="email" defaultValue={user?.email} readOnly />
        </FormField>
        <Button variant="secondary" disabled>
          Save (demo)
        </Button>
      </div>
    </div>
  );
}

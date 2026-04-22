"use client";

import { Button, FormField, Input } from "@ssu/ui";

export function SessionScheduler() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-card space-y-4 max-w-md">
      <FormField id="title" label="Session title">
        <Input id="title" placeholder="Live workshop" />
      </FormField>
      <FormField id="when" label="Start time">
        <Input id="when" type="datetime-local" />
      </FormField>
      <Button type="button" variant="primary">
        Save session (demo)
      </Button>
    </div>
  );
}

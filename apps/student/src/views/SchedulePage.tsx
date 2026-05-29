"use client";

import { EmptyState } from "@ssu/ui";
import { Megaphone } from "lucide-react";

export function SchedulePage() {
  return (
    <EmptyState
      icon={Megaphone}
      title="Your calendar is on going"
      description="When it's done, it will show up here"
    />
  );
}

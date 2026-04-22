import type { Meta, StoryObj } from "@storybook/react";
import { Inbox } from "lucide-react";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Molecules/EmptyState",
  component: EmptyState,
  args: { icon: Inbox, title: "Nothing here", description: "Try again later." },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

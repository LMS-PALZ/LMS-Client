import type { Meta, StoryObj } from "@storybook/react";
import { TopHeader } from "./TopHeader";

const meta: Meta<typeof TopHeader> = {
  title: "Organisms/TopHeader",
  component: TopHeader,
  args: {
    titleSlot: <span className="text-h4 text-neutral-700">Page</span>,
    endSlot: <span className="text-small text-neutral-500">Actions</span>,
  },
};

export default meta;
type Story = StoryObj<typeof TopHeader>;

export const Default: Story = {};

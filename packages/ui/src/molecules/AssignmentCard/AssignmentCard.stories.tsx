import type { Meta, StoryObj } from "@storybook/react";
import { AssignmentCard } from "./AssignmentCard";

const meta: Meta<typeof AssignmentCard> = {
  title: "Molecules/AssignmentCard",
  component: AssignmentCard,
  args: {
    title: "Essay",
    courseName: "Writing 101",
    dueAt: new Date().toISOString(),
    statusVariant: "not-started",
    statusLabel: "Not started",
  },
};

export default meta;
type Story = StoryObj<typeof AssignmentCard>;

export const Default: Story = {};

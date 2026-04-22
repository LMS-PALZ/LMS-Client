import type { Meta, StoryObj } from "@storybook/react";
import { UserRow } from "./UserRow";

const meta: Meta<typeof UserRow> = {
  title: "Molecules/UserRow",
  component: UserRow,
  args: {
    firstName: "Sam",
    lastName: "Student",
    email: "sam@example.com",
    roleVariant: "student",
    roleLabel: "Student",
    statusVariant: "active",
    statusLabel: "Active",
  },
};

export default meta;
type Story = StoryObj<typeof UserRow>;

export const Default: Story = {};

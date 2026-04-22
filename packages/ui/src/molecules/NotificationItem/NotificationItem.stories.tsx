import type { Meta, StoryObj } from "@storybook/react";
import { Bell } from "lucide-react";
import { NotificationItem } from "./NotificationItem";

const meta: Meta<typeof NotificationItem> = {
  title: "Molecules/NotificationItem",
  component: NotificationItem,
  args: {
    icon: Bell,
    message: "Assignment graded",
    createdAt: new Date().toISOString(),
    read: false,
  },
};

export default meta;
type Story = StoryObj<typeof NotificationItem>;

export const Default: Story = {};

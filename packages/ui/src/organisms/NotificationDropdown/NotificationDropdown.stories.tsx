import type { Meta, StoryObj } from "@storybook/react";
import { Info } from "lucide-react";
import { NotificationItem } from "../../molecules/NotificationItem";
import { NotificationDropdown } from "./NotificationDropdown";

const meta: Meta<typeof NotificationDropdown> = {
  title: "Organisms/NotificationDropdown",
  component: NotificationDropdown,
  args: {
    children: (
      <div className="space-y-1 p-1">
        <NotificationItem
          icon={Info}
          message="Test"
          createdAt={new Date().toISOString()}
          read={false}
        />
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof NotificationDropdown>;

export const Default: Story = {};

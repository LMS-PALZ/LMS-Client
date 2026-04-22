import type { Meta, StoryObj } from "@storybook/react";
import { Users } from "lucide-react";
import { StatCard } from "./StatCard";

const meta: Meta<typeof StatCard> = {
  title: "Molecules/StatCard",
  component: StatCard,
  args: { label: "Students", value: 120, icon: Users },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {};

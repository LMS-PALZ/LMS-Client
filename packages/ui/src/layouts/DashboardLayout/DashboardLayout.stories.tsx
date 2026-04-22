import type { Meta, StoryObj } from "@storybook/react";
import { DashboardLayout } from "./DashboardLayout";

const meta: Meta<typeof DashboardLayout> = {
  title: "Layouts/DashboardLayout",
  component: DashboardLayout,
  args: {
    sidebar: <div className="p-4 text-white text-small">Sidebar</div>,
    header: <span className="text-h4">Header</span>,
    children: <p className="text-body">Main</p>,
  },
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

export const Default: Story = {};

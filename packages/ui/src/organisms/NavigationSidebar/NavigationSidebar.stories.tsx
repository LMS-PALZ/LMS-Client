import type { Meta, StoryObj } from "@storybook/react";
import { Home, Settings } from "lucide-react";
import { NavigationSidebar } from "./NavigationSidebar";

const meta: Meta<typeof NavigationSidebar> = {
  title: "Organisms/NavigationSidebar",
  component: NavigationSidebar,
  decorators: [
    (Story) => (
      <div className="h-[400px] w-sidebar bg-brand-green">
        <Story />
      </div>
    ),
  ],
  args: {
    pathname: "/dashboard",
    items: [
      { href: "/dashboard", label: "Home", icon: Home },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
};

export default meta;
type Story = StoryObj<typeof NavigationSidebar>;

export const Default: Story = {};

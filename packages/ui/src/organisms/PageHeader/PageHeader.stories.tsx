import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../../atoms/Button";
import { PageHeader } from "./PageHeader";

const meta: Meta<typeof PageHeader> = {
  title: "Organisms/PageHeader",
  component: PageHeader,
  args: {
    title: "Dashboard",
    breadcrumbs: [{ label: "Home", href: "/" }, { label: "Dashboard" }],
    action: <Button size="sm">New</Button>,
  },
};

export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {};

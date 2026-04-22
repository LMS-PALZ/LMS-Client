import type { Meta, StoryObj } from "@storybook/react";
import { Mail } from "lucide-react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Button" },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};
export const Loading: Story = { args: { loading: true } };
export const WithIcons: Story = {
  args: { leftIcon: <Mail className="h-4 w-4" />, children: "Email" },
};

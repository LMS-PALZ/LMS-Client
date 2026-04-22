import type { Meta, StoryObj } from "@storybook/react";
import { AuthLayout } from "./AuthLayout";

const meta: Meta<typeof AuthLayout> = {
  title: "Layouts/AuthLayout",
  component: AuthLayout,
  args: { children: <p className="text-body">Form</p> },
};

export default meta;
type Story = StoryObj<typeof AuthLayout>;

export const Default: Story = {};

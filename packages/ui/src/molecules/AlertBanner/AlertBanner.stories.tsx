import type { Meta, StoryObj } from "@storybook/react";
import { AlertBanner } from "./AlertBanner";

const meta: Meta<typeof AlertBanner> = {
  title: "Molecules/AlertBanner",
  component: AlertBanner,
  args: { children: "Something happened." },
};

export default meta;
type Story = StoryObj<typeof AlertBanner>;

export const Error: Story = { args: { variant: "error", title: "Error" } };
export const Warning: Story = {
  args: { variant: "warning", title: "Heads up" },
};

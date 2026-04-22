import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
  args: { value: 45 },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {};
export const WithLabel: Story = { args: { showLabel: true, value: 72 } };

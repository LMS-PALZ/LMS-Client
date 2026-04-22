import type { Meta, StoryObj } from "@storybook/react";
import { StepWizard } from "./StepWizard";

const meta: Meta<typeof StepWizard> = {
  title: "Organisms/StepWizard",
  component: StepWizard,
  args: {
    activeIndex: 1,
    steps: [
      { id: "1", label: "Details" },
      { id: "2", label: "Modules" },
      { id: "3", label: "Review" },
    ],
    children: <p className="text-body">Step content</p>,
  },
};

export default meta;
type Story = StoryObj<typeof StepWizard>;

export const Default: Story = {};

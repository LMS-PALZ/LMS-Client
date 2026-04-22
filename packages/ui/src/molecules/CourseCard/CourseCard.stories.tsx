import type { Meta, StoryObj } from "@storybook/react";
import { CourseCard } from "./CourseCard";

const meta: Meta<typeof CourseCard> = {
  title: "Molecules/CourseCard",
  component: CourseCard,
  args: {
    title: "Intro to Web",
    trainerName: "Jane Doe",
    progressPercent: 40,
    onContinue: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CourseCard>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react";
import { FullPageLayout } from "./FullPageLayout";

const meta: Meta<typeof FullPageLayout> = {
  title: "Layouts/FullPageLayout",
  component: FullPageLayout,
  args: {
    header: <span className="text-small font-medium">Classroom</span>,
    children: (
      <>
        <div className="flex-[0.65] bg-black p-4 text-white">Video</div>
        <div className="flex-[0.35] border-l bg-white p-4">Sidebar</div>
      </>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof FullPageLayout>;

export const Default: Story = {};

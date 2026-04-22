import type { Meta, StoryObj } from "@storybook/react";
import { FileDropzone } from "./FileDropzone";

const meta: Meta<typeof FileDropzone> = {
  title: "Molecules/FileDropzone",
  component: FileDropzone,
  args: { onFiles: () => {} },
};

export default meta;
type Story = StoryObj<typeof FileDropzone>;

export const Default: Story = {};

import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../../atoms/Input";
import { FormField } from "./FormField";

const meta: Meta<typeof FormField> = {
  title: "Molecules/FormField",
  component: FormField,
  args: {
    id: "email",
    label: "Email",
    children: <Input id="email" placeholder="you@example.com" />,
  },
};

export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = {};
export const WithError: Story = { args: { error: "Invalid email" } };

"use client";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchInput } from "./SearchInput";

const meta: Meta<typeof SearchInput> = {
  title: "Molecules/SearchInput",
  component: SearchInput,
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

function Stateful() {
  const [q, setQ] = useState("");
  return (
    <SearchInput
      placeholder="Search…"
      value={q}
      onChange={(e) => setQ(e.target.value)}
      onClear={() => setQ("")}
    />
  );
}

export const Default: Story = { render: () => <Stateful /> };

import type { Meta, StoryObj } from "@storybook/react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./DataTable";

type Row = { name: string; role: string };

const columns: ColumnDef<Row, string>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
];

const meta: Meta<typeof DataTable<Row, string>> = {
  title: "Organisms/DataTable",
  component: DataTable,
  args: {
    columns,
    data: [
      { name: "A", role: "student" },
      { name: "B", role: "trainer" },
    ],
    searchable: true,
  },
};

export default meta;
type Story = StoryObj<typeof DataTable<Row, string>>;

export const Default: Story = {};

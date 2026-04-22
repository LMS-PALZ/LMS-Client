import { render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import { describe, expect, it } from "vitest";
import { DataTable } from "./DataTable";

type R = { id: string };

describe("DataTable", () => {
  it("renders rows", () => {
    const cols: ColumnDef<R, string>[] = [{ accessorKey: "id", header: "ID" }];
    render(<DataTable columns={cols} data={[{ id: "1" }]} />);
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});

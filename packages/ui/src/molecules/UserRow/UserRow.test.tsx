import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { UserRow } from "./UserRow";

describe("UserRow", () => {
  it("renders name", () => {
    render(
      <UserRow
        firstName="A"
        lastName="B"
        email="a@b.co"
        roleVariant="admin"
        roleLabel="Admin"
        statusVariant="active"
        statusLabel="Active"
      />,
    );
    expect(screen.getByText("A B")).toBeInTheDocument();
  });
});

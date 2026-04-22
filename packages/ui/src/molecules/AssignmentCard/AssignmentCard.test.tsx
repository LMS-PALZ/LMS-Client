import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AssignmentCard } from "./AssignmentCard";

describe("AssignmentCard", () => {
  it("renders", () => {
    render(
      <AssignmentCard
        title="A"
        courseName="C"
        dueAt="2026-01-01T00:00:00Z"
        statusVariant="submitted"
        statusLabel="Submitted"
      />,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});

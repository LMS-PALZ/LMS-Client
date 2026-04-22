import { render, screen } from "@testing-library/react";
import { FolderOpen } from "lucide-react";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders title", () => {
    render(<EmptyState icon={FolderOpen} title="Empty" />);
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });
});

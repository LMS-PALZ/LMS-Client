import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopHeader } from "./TopHeader";

describe("TopHeader", () => {
  it("renders slots", () => {
    render(<TopHeader titleSlot={<span>T</span>} endSlot={<span>E</span>} />);
    expect(screen.getByText("T")).toBeInTheDocument();
    expect(screen.getByText("E")).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("shows initials", () => {
    render(<Avatar firstName="A" lastName="B" />);
    expect(screen.getByText("AB")).toBeInTheDocument();
  });
});

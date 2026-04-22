import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./Label";

describe("Label", () => {
  it("renders", () => {
    render(<Label htmlFor="e">Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });
});

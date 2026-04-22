import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("renders title", () => {
    render(<PageHeader title="T" />);
    expect(screen.getByRole("heading", { name: "T" })).toBeInTheDocument();
  });
});

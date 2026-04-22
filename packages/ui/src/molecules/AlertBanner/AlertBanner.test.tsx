import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AlertBanner } from "./AlertBanner";

describe("AlertBanner", () => {
  it("is alert", () => {
    render(<AlertBanner variant="error">Bad</AlertBanner>);
    expect(screen.getByRole("alert")).toHaveTextContent("Bad");
  });
});

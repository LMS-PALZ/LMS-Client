import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("shows error", () => {
    render(
      <FormField id="x" label="L" error="Bad">
        <input id="x" />
      </FormField>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Bad");
  });
});

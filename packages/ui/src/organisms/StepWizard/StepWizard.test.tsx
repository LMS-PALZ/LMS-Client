import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StepWizard } from "./StepWizard";

describe("StepWizard", () => {
  it("shows steps", () => {
    render(
      <StepWizard activeIndex={0} steps={[{ id: "a", label: "One" }]}>
        X
      </StepWizard>,
    );
    expect(screen.getByText("One")).toBeInTheDocument();
  });
});

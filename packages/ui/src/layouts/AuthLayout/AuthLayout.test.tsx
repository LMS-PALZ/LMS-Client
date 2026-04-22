import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuthLayout } from "./AuthLayout";

describe("AuthLayout", () => {
  it("renders children", () => {
    render(
      <AuthLayout>
        <span>Child</span>
      </AuthLayout>,
    );
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});

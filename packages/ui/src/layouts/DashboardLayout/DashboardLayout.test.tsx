import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { DashboardLayout } from "./DashboardLayout";

describe("DashboardLayout", () => {
  it("renders main", () => {
    render(
      <DashboardLayout sidebar={<div />} header={<div />}>
        <span>Main</span>
      </DashboardLayout>,
    );
    expect(screen.getByText("Main")).toBeInTheDocument();
  });
});

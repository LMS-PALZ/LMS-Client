import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FullPageLayout } from "./FullPageLayout";

describe("FullPageLayout", () => {
  it("renders", () => {
    render(
      <FullPageLayout header={<span>H</span>}>
        <span>M</span>
      </FullPageLayout>,
    );
    expect(screen.getByText("M")).toBeInTheDocument();
  });
});

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./Skeleton";

describe("Skeleton", () => {
  it("renders", () => {
    const { container } = render(<Skeleton className="h-2 w-8" />);
    expect(container.firstChild).toBeTruthy();
  });
});

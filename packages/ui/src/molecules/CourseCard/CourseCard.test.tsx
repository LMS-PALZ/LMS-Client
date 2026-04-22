import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CourseCard } from "./CourseCard";

describe("CourseCard", () => {
  it("renders title", () => {
    render(
      <CourseCard
        title="T"
        trainerName="Tr"
        progressPercent={10}
        onContinue={vi.fn<() => void>()}
      />,
    );
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});

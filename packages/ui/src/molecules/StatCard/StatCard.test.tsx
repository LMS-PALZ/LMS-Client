import { render, screen } from "@testing-library/react";
import { BookOpen } from "lucide-react";
import { describe, expect, it } from "vitest";
import { StatCard } from "./StatCard";

describe("StatCard", () => {
  it("shows label and value", () => {
    render(<StatCard label="Courses" value={3} icon={BookOpen} />);
    expect(screen.getByText("Courses")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });
});

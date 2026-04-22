import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Modal } from "./Modal";

describe("Modal", () => {
  it("shows title when open", () => {
    render(
      <Modal open title="T" onOpenChange={vi.fn<(open: boolean) => void>()}>
        x
      </Modal>,
    );
    expect(screen.getByText("T")).toBeInTheDocument();
  });
});

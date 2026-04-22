import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileDropzone } from "./FileDropzone";

describe("FileDropzone", () => {
  it("renders", () => {
    const { container } = render(
      <FileDropzone onFiles={vi.fn<(files: File[]) => void>()} />,
    );
    expect(container.textContent).toContain("Drag files");
  });
});

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NotificationDropdown } from "./NotificationDropdown";

describe("NotificationDropdown", () => {
  it("renders trigger", () => {
    render(
      <NotificationDropdown>
        <span>Inside</span>
      </NotificationDropdown>,
    );
    expect(
      screen.getByRole("button", { name: "Open notifications" }),
    ).toBeInTheDocument();
  });
});

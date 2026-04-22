import { render, screen } from "@testing-library/react";
import { Info } from "lucide-react";
import { describe, expect, it } from "vitest";
import { NotificationItem } from "./NotificationItem";

describe("NotificationItem", () => {
  it("renders message", () => {
    render(
      <NotificationItem
        icon={Info}
        message="Hello"
        createdAt="2024-01-01T12:00:00Z"
        read
      />,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});

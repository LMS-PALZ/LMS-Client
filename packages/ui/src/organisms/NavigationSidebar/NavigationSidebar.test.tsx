import { render, screen } from "@testing-library/react";
import { Home } from "lucide-react";
import { describe, expect, it } from "vitest";
import { NavigationSidebar } from "./NavigationSidebar";

describe("NavigationSidebar", () => {
  it("renders links", () => {
    render(
      <NavigationSidebar
        pathname="/x"
        items={[{ href: "/x", label: "Home", icon: Home }]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute(
      "href",
      "/x",
    );
  });
});

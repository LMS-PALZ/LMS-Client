import { render, screen, waitFor } from "@testing-library/react";
import { LoginPage } from "../views/LoginPage";
import { AppProviders } from "../providers";

describe("Student App", () => {
  it("renders login", async () => {
    render(
      <AppProviders>
        <LoginPage />
      </AppProviders>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /sign in/i }),
      ).toBeInTheDocument();
    });
  });
});

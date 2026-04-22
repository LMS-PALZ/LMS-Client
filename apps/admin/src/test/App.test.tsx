import { render, screen, waitFor } from "@testing-library/react";
import { LoginPage } from "../views/LoginPage";
import { AppProviders } from "../providers";

describe("Admin App", () => {
  it("renders login", async () => {
    render(
      <AppProviders>
        <LoginPage />
      </AppProviders>,
    );
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /admin sign in/i }),
      ).toBeInTheDocument();
    });
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ModeToggle } from "@/components/mode-toggle";

const setThemeMock = vi.fn();

vi.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: setThemeMock,
  }),
}));

describe("ModeToggle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the theme toggle button", () => {
    render(<ModeToggle />);
    expect(
      screen.getByRole("button", { name: /toggle theme/i })
    ).toBeInTheDocument();
  });

  it("calls setTheme with 'light' when Light mode is clicked", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);
    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    await user.click(screen.getByText("Light"));
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });

  it("calls setTheme with 'dark' when Dark mode is clicked", async () => {
    const user = userEvent.setup();
    render(<ModeToggle />);
    await user.click(screen.getByRole("button", { name: /toggle theme/i }));
    await user.click(screen.getByText("Dark"));
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });
});

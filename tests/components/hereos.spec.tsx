import { render, screen } from "@testing-library/react";

import Heroes from "@/app/(marketing)/_components/heroes";

describe("Hereos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render image with light theme", () => {
    render(<Heroes />);
    const lightImage = screen.getByRole("img", { name: "notion-parade" });
    const darkImage = screen.getByRole("img", { name: "notion-parade-light" });
    expect(lightImage).toBeInTheDocument();
    expect(darkImage).toHaveAttribute(
      "class",
      expect.stringContaining("hidden")
    );
    expect(lightImage).toHaveAttribute(
      "src",
      expect.stringContaining("notion-parade.webp")
    );
  });

  it("should render image with dark theme", () => {
    render(<Heroes />);
    const lightImage = screen.getByRole("img", { name: "notion-parade" });
    const darkImage = screen.getByRole("img", { name: "notion-parade-light" });
    expect(darkImage).toBeInTheDocument();
    expect(lightImage).toHaveAttribute(
      "class",
      expect.stringContaining("dark:hidden")
    );
    expect(darkImage).toHaveAttribute(
      "src",
      expect.stringContaining("notion-parade-light.webp")
    );
  });
});

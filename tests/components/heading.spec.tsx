import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Router from "next-router-mock";

import Heading from "@/app/(marketing)/_components/heading";
import { marketingEnglish } from "@/i18n/en/marketing";

const convex_auth = { isLoading: false, isAuthenticated: true };

vi.mock("convex/react", () => ({
  useConvexAuth: () => convex_auth,
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        marketing: marketingEnglish,
      })[key] || key,
  }),
}));

vi.mock("@clerk/clerk-react", () => ({
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("heading", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("render UI", () => {
    render(<Heading />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it("render button if user is not authenticated", () => {
    convex_auth.isLoading = false;
    convex_auth.isAuthenticated = false;
    render(<Heading />);
    expect(
      screen.getByRole("button", { name: /get jotion free/i })
    ).toBeInTheDocument();
  });

  it("render button if user is authenticated", async () => {
    const user = userEvent.setup();
    convex_auth.isLoading = false;
    convex_auth.isAuthenticated = true;
    render(<Heading />);
    const link = screen.getByRole("link", { name: /enter jotion/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/documents");
    await user.click(link);
    await Router.push("/documents");
    expect(Router.asPath).toBe("/documents");
  });
});

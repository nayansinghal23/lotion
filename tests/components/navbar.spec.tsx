import { render, screen } from "@testing-library/react";

import Navbar from "@/app/(marketing)/_components/navbar";

const user = {
    id: "123",
    firstName: "Nayan",
    lastName: "Singhal",
    fullName: "Nayan Singhal",
    emailAddresses: [{ emailAddress: "nayansinghal393@gmail.com" }],
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaXMxVU8wM1Q2RFlZRUdncVplbGZnekU5ZloifQ",
  },
  convex_auth = { isLoading: false, isAuthenticated: true };

vi.mock("convex/react", () => ({
  useConvexAuth: () => convex_auth,
  useMutation: () => vi.fn(),
  ConvexProviderWithAuth: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({
    user,
  }),
  SignInButton: ({ children }: { children: React.ReactNode }) => (
    <div>
      {children}
      <button role="github-button">Continue with GitHub</button>
    </div>
  ),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        marketing: { log_in: "Log in" },
      })[key] || key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
    },
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

describe("navbar", () => {
  it("render Jotion title", () => {
    render(<Navbar />);
    expect(screen.getByText("Jotion")).toBeInTheDocument();
  });

  it("render log in button if user is not authenticated", () => {
    convex_auth.isAuthenticated = false;
    convex_auth.isLoading = false;
    render(<Navbar />);
    expect(screen.getByText("Log in")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("render user image if user is authenticated", () => {
    convex_auth.isAuthenticated = true;
    convex_auth.isLoading = false;
    render(<Navbar />);
    expect(screen.queryByText("Log in")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "user-img" })).toBeInTheDocument();
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      expect.stringContaining("https%3A%2F%2Fimg.clerk.com%2F")
    );
  });
});

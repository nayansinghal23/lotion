import { render, screen } from "@testing-library/react";

import DocumentsPage from "@/app/(main)/(routes)/documents/page";
import { documentsEnglish } from "@/i18n/en/documents";

const user = {
  id: "123",
  firstName: "Nayan",
  lastName: "Singhal",
  fullName: "Nayan Singhal",
  emailAddresses: [{ emailAddress: "nayansinghal393@gmail.com" }],
  imageUrl:
    "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaXMxVU8wM1Q2RFlZRUdncVplbGZnekU5ZloifQ",
};

vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({
    user,
  }),
}));

vi.mock("convex/react", () => ({
  useMutation: () => vi.fn(),
  useQuery: () => vi.fn(),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => documentsEnglish,
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    promise: vi.fn(),
  },
}));

describe("Documents Page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the documents page", () => {
    render(<DocumentsPage />);
    const button = screen.getByRole("button", { name: /create a note/i });
    const heading = screen.getByRole("heading", {
      name: /welcome to nayan's jotion/i,
    });
    expect(heading).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });
});

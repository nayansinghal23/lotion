import { toast } from "sonner";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Id } from "@/convex/_generated/dataModel";
import { documentsEnglish } from "@/i18n/en/documents";
import DocumentsPage from "@/app/(main)/(routes)/documents/page";

const user = {
    id: "123",
    firstName: "Nayan",
    lastName: "Singhal",
    fullName: "Nayan Singhal",
    emailAddresses: [{ emailAddress: "nayansinghal393@gmail.com" }],
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaXMxVU8wM1Q2RFlZRUdncVplbGZnekU5ZloifQ",
  },
  subscription: any = {
    docIds: [],
    limits: 5,
    plans_purchased: [],
  };

vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({
    user,
  }),
}));

vi.mock("convex/react", () => ({
  useMutation: () => {
    return () => {
      if (!user || !user.id) return "Not authenticated";
      return new Promise((resolve, reject) => {
        const id = "j571r3vs84t566nbeherrmwtmd75n9ad" as Id<"documents">;
        const found: boolean = subscription.docIds.reduce(
          (acc: boolean, docId: any) => {
            if (docId.id === id) return (acc = true);
            return acc;
          },
          false
        );
        if (!found) {
          subscription.docIds = [...subscription.docIds, { id, shared: 1 }];
        }
        resolve(id);
      });
    };
  },
  useQuery: () => {
    if (!user || !user.id) return "Not authenticated";
    return subscription;
  },
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

  it("testing onCreate function when limit exceeds", async () => {
    const user = userEvent.setup();
    subscription.docIds = [
      { id: "j571r3vs84t566nbeherrmwtmd75n8ad" as Id<"documents">, shared: 1 },
      { id: "j571r3vs84t566nbeherrmwtmd76n8ad" as Id<"documents">, shared: 1 },
      { id: "j571r3vs84t566nbeherrmwtmd77n8ad" as Id<"documents">, shared: 1 },
      { id: "j571r3vs84t566nbeherrmwtmd78n8ad" as Id<"documents">, shared: 1 },
      { id: "j571r3vs84t566nbeherrmwtmd79n8ad" as Id<"documents">, shared: 1 },
    ];
    render(<DocumentsPage />);
    const button = screen.getByRole("button", { name: /create a note/i });
    await user.click(button);
    expect(toast.promise).toHaveBeenCalledWith(expect.any(Promise), {
      loading: "Creating a new note...",
      success: "Limited exceeded. Visit plans.",
      error: "Failed to create a new note.",
    });
  });

  it("testing onCreate function when limit doesn't exceeds", async () => {
    const user = userEvent.setup();
    subscription.docIds = [];
    render(<DocumentsPage />);
    const button = screen.getByRole("button", { name: /create a note/i });
    await user.click(button);
    expect(subscription).toHaveProperty("docIds", [
      { id: "j571r3vs84t566nbeherrmwtmd75n9ad", shared: 1 },
    ]);
    expect(subscription).toHaveProperty("limits", 5);
    expect(subscription).toHaveProperty("plans_purchased", []);
    expect(toast.promise).toHaveBeenCalledWith(expect.any(Promise), {
      loading: "Creating a new note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  });
});

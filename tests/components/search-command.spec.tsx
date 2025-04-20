import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import SearchCommand from "@/components/search-command";

const user = {
    id: "123",
    firstName: "Nayan",
    lastName: "Singhal",
    fullName: "Nayan Singhal",
    emailAddresses: [{ emailAddress: "nayansinghal393@gmail.com" }],
    imageUrl:
      "https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ2l0aHViL2ltZ18yaXMxVU8wM1Q2RFlZRUdncVplbGZnekU5ZloifQ",
  },
  selector = {
    open: true,
  },
  dispatch = vi
    .fn()
    .mockImplementation((data: { type: string; payload: boolean }) => {
      if (data.type === "search/toggleSearch") selector.open = data.payload;
    }),
  push = vi.fn().mockImplementation((href: string) => {});
let documents: any[] = [];

vi.mock("@/redux/hooks", () => ({
  useAppSelector: vi.fn().mockImplementation(() => selector),
  useAppDispatch: vi.fn().mockImplementation(() => dispatch),
}));

vi.mock("@clerk/clerk-react", () => ({
  useUser: () => ({
    user,
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn().mockImplementation(() => ({
    push,
  })),
}));

vi.mock("convex/react", () => ({
  useQuery: vi.fn().mockImplementation(() => documents),
}));

describe("SearchCommand", () => {
  beforeAll(() => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    Element.prototype.scrollIntoView = vi.fn();
  });

  it("testing for empty data", () => {
    render(<SearchCommand />);
    const input = screen.getByPlaceholderText(
      `Search ${user.fullName}'s Jotion...`
    );
    const results = screen.getByText("No results found.");
    expect(input).toBeInTheDocument();
    expect(results).toBeInTheDocument();
  });

  it("test for searching an existing docs", async () => {
    documents = [
      {
        _id: "j571r3vs84t566nbeherrmwtmd75n9ad",
        title: "Security",
        icon: null,
      },
      {
        _id: "j571r3vs84t566nbeherrmwtmd75n8ad",
        title: "Unit Testing",
        icon: "🤩",
      },
    ];
    const event = userEvent.setup();
    render(<SearchCommand />);
    const input = screen.getByPlaceholderText(
      `Search ${user.fullName}'s Jotion...`
    );
    let results = documents.map((document) =>
      screen.getByTitle(document.title)
    );
    expect(input).toBeInTheDocument();
    expect(results.length).toBe(2);
    results.forEach((result) => {
      expect(result).toBeInTheDocument();
    });
    const search = "unit";
    await event.type(input, search);
    expect(input).toHaveValue(search);
    documents = documents.filter((document) =>
      document.title.toLowerCase().includes(search.toLowerCase())
    );
    expect(documents.length).toBe(1);
    expect(screen.getByTitle("Unit Testing")).toBeInTheDocument();
    expect(screen.queryByTitle("Security")).not.toBeInTheDocument();
    await event.click(screen.getByTitle("Unit Testing"));
    const _id = documents.reduce((acc, document) => {
      if (document.title === "Unit Testing") return (acc = document._id);
      return acc;
    }, "");
    expect(push).toHaveBeenCalledWith(`/documents/${_id}`);
    expect(dispatch).toHaveBeenCalledWith({
      payload: false,
      type: "search/toggleSearch",
    });
    expect(selector.open).toBe(false);
  });

  it("test for searching a non-existing docs", async () => {
    documents = [
      {
        _id: "j571r3vs84t566nbeherrmwtmd75n9ad",
        title: "Security",
        icon: null,
      },
      {
        _id: "j571r3vs84t566nbeherrmwtmd75n8ad",
        title: "Unit Testing",
        icon: "🤩",
      },
    ];
    selector.open = true;
    const event = userEvent.setup();
    render(<SearchCommand />);
    const input = screen.getByPlaceholderText(
      `Search ${user.fullName}'s Jotion...`
    );
    let results = documents.map((document) =>
      screen.getByTitle(document.title)
    );
    expect(input).toBeInTheDocument();
    expect(results.length).toBe(2);
    results.forEach((result) => {
      expect(result).toBeInTheDocument();
    });
    const search = "nayan";
    await event.type(input, search);
    expect(input).toHaveValue(search);
    documents = documents.filter((document) =>
      document.title.toLowerCase().includes(search.toLowerCase())
    );
    expect(documents.length).toBe(0);
    expect(screen.queryByTitle("Unit Testing")).not.toBeInTheDocument();
    expect(screen.queryByTitle("Security")).not.toBeInTheDocument();
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("open modal when user press Ctrl + K", async () => {
    const event = userEvent.setup();
    dispatch({ type: "search/toggleSearch", payload: false });
    render(<SearchCommand />);
    expect(selector.open).toBeFalsy();
    await event.keyboard("{Control>}{k}{/Control}");
    expect(selector.open).toBeTruthy();
  });
});

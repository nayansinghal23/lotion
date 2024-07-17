import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { File } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { searchSelector, toggleSearch } from "@/redux/openSearchSlice";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { DialogTitle } from "./ui/dialog";

const SearchCommand = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(searchSelector);
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);

  const onSelect = (id: string) => {
    router.push(`/documents/${id}`);
    dispatch(toggleSearch(false));
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(toggleSearch(selector.open ? false : true));
      }
    };
    document.addEventListener("keydown", down);

    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog
      open={selector.open}
      onOpenChange={() => dispatch(toggleSearch(false))}
    >
      <DialogTitle className="truncate">
        <VisuallyHidden.Root>Search Bar</VisuallyHidden.Root>
      </DialogTitle>
      <CommandInput placeholder={`Search ${user?.fullName}'s Jotion...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((document) => (
            <CommandItem
              key={document._id}
              value={`${document._id}-${document.title}`}
              title={document.title}
              onSelect={() => onSelect(document._id)}
            >
              {document.icon ? (
                <p className="mr-2 text-[18px]">{document.icon}</p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              <span>{document.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommand;

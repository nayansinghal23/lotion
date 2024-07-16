import React from "react";
import {
  ChevronLeftIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { INavigation } from "@/interfaces/interface";
import { api } from "@/convex/_generated/api";
import UserItem from "./user-item";
import Item from "./item";
import DocumentList from "./document-list";
import TrashBox from "./trash-box";

const Navigation = ({ minimize }: INavigation) => {
  const create = useMutation(api.documents.create);

  const handleCreate = () => {
    const promise = create({
      title: "Untitled",
    });
    toast.promise(promise, {
      loading: "Creating a mew note...",
      success: "New note created!",
      error: "Failed to create a new note.",
    });
  };

  return (
    <div className="h-full w-full relative bg-neutral-300 dark:bg-[#2b2929]">
      <div
        className="hidden md:block h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 hover:opacity-100 transition"
        onClick={minimize}
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </div>
      <div>
        <UserItem />
        <Item label="Search" icon={Search} isSearch onClick={() => {}} />
        <Item label="Settings" icon={Settings} onClick={() => {}} />
        <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
      </div>
      <div className="mt-4">
        <DocumentList />
        <Item onClick={handleCreate} icon={Plus} label="Add a page" />
        <Popover>
          <PopoverTrigger className="w-full mt-4">
            <Item label="Trash" icon={Trash} />
          </PopoverTrigger>
          <PopoverContent side="bottom" className="p-0 w-72">
            <TrashBox />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Navigation;

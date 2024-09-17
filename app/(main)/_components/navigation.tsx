import React from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronLeftIcon,
  Plus,
  PlusCircle,
  Search,
  Share,
  Trash,
} from "lucide-react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/convex/_generated/api";
import { INavigation } from "@/interfaces/interface";
import { useAppDispatch } from "@/redux/hooks";
import { toggleSearch } from "@/redux/openSearchSlice";
import Item from "./item";
import DocumentList from "./document-list";
import TrashBox from "./trash-box";
import SharedList from "./shared-list";

const Navigation = ({ minimize }: INavigation) => {
  const { user } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const create = useMutation(api.documents.create);

  const handleCreate = () => {
    const today = new Date();
    const indexOf = today.toString().indexOf("GMT") - 1;
    const promise = create({
      title: "Untitled",
      time: `${today.toString().slice(0, indexOf)}`,
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
        <div className="flex items-center justify-between text-sm p-3 w-full">
          <div className="gap-x-2 flex items-center max-w-[80%]">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className="text-start font-medium whitespace-nowrap overflow-hidden text-ellipsis">
              {user?.fullName}'s Jotion
            </span>
          </div>
        </div>
        <Item
          label="Search"
          icon={Search}
          isSearch
          onClick={() => dispatch(toggleSearch(true))}
        />
        <Item
          label="Notifications"
          icon={Bell}
          onClick={() => router.push("/notifications")}
        />
        <Item onClick={handleCreate} label="New page" icon={PlusCircle} />
      </div>
      <div className="mt-4">
        <Item onClick={() => {}} icon={Share} label="Shared" />
        <SharedList />
      </div>
      <div className="mt-4">
        <Item onClick={handleCreate} icon={Plus} label="Add a page" />
        <DocumentList />
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

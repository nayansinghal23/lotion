import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Bot,
  Calendar,
  ChevronLeftIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Share,
  Trash,
  Video,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { useUser } from "@clerk/clerk-react";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";

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
import { useTranslation } from "react-i18next";

const Navigation = ({ minimize }: INavigation) => {
  const { t } = useTranslation();
  const {
    name,
    search,
    notifications,
    settings,
    event,
    new_page,
    shared,
    add_page,
    trash,
  }: any = t("navigation");
  const { title }: any = t("meeting");
  const { user } = useUser();
  const client = useStreamVideoClient();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const create = useMutation(api.documents.create);
  const updatingDocIds = useMutation(api.users.updatingDocIds);
  const displaySubscription = useQuery(api.users.displaySubscription, {});
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });
  const [callDetails, setCallDetails] = useState<Call>();

  const handleCreate = () => {
    if (
      !displaySubscription ||
      typeof displaySubscription === "string" ||
      displaySubscription.docIds.length >= displaySubscription.limits
    ) {
      toast.promise(new Promise((resolve, reject) => resolve("")), {
        loading: "Creating a new note...",
        success: "Limited exceeded. Visit plans.",
        error: "Failed to create a new note.",
      });
      return;
    }
    const today = new Date();
    const indexOf = today.toString().indexOf("GMT") - 1;
    const promise = create({
      title: "Untitled",
      time: `${today.toString().slice(0, indexOf)}`,
    }).then((id) => {
      updatingDocIds({
        id,
        type: "create",
      });
      toast.promise(promise, {
        loading: "Creating a mew note...",
        success: "New note created!",
        error: "Failed to create a new note.",
      });
    });
  };

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      const id = crypto.randomUUID();
      const call = client.call("default", id);

      if (!call) return;

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant meeting";

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });

      setCallDetails(call);
      toast.promise(
        new Promise((resolve, reject) => {
          resolve("Meet scheduled!");
        }),
        {
          loading: "Scheduling meet...",
          success: "Meet scheduled!",
          error: "Failed to schedule meet.",
        }
      );
      if (!values.description) {
        router.push(`/meeting/${call.id}`);
      }
    } catch (error) {
      console.log(error);
      toast.promise(
        new Promise((resolve, reject) => {
          reject("Failed to schedule meet.");
        }),
        {
          loading: "Scheduling meet...",
          success: "Meet scheduled!",
          error: "Failed to schedule meet.",
        }
      );
    }
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
              {user?.fullName}'s {name}
            </span>
          </div>
        </div>
        <Item
          label={search}
          icon={Search}
          isSearch
          onClick={() => dispatch(toggleSearch(true))}
        />
        <Item
          label={notifications}
          icon={Bell}
          onClick={() => router.push("/notifications")}
        />
        <Item
          label={settings}
          icon={Settings}
          onClick={() => router.push("/settings")}
        />
        <Item
          label={event}
          icon={Calendar}
          onClick={() =>
            window.open(
              "https://calendar.google.com/calendar/u/0/r/eventedit?date=DATE_START/DATE_END&text=TITLE&location=LOCATION&details=DESCRIPTION"
            )
          }
        />
        <Item label={title} icon={Video} onClick={createMeeting} />
        <Item label="AI" icon={Bot} onClick={() => router.push("/ai")} />
        <Item onClick={handleCreate} label={new_page} icon={PlusCircle} />
      </div>
      <div className="mt-4">
        <Item onClick={() => {}} icon={Share} label={shared} />
        <SharedList />
      </div>
      <div className="mt-4">
        <Item onClick={handleCreate} icon={Plus} label={add_page} />
        <DocumentList />
        <Popover>
          <PopoverTrigger className="w-full mt-4">
            <Item label={trash} icon={Trash} />
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

import React from "react";
import { ChevronLeftIcon } from "lucide-react";
import { useQuery } from "convex/react";

import { INavigation } from "@/interfaces/interface";
import { api } from "@/convex/_generated/api";
import UserItem from "./user-item";

const Navigation = ({ minimize }: INavigation) => {
  const documents = useQuery(api.documents.get);

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
      </div>
      <div className="mt-4">
        {documents?.map((document) => (
          <p key={document._id}>{document.title}</p>
        ))}
      </div>
    </div>
  );
};

export default Navigation;

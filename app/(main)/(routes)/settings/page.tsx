"use client";
import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";
import { SignOutButton } from "@clerk/clerk-react";

import Appearance from "../_components/appearance";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { isAuthenticated } = useConvexAuth();

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="dark:bg-[#1F1F1F] h-full w-full">
      <p className="p-[7.5px] border-b dark:border-b-white border-b-black min-h-11">
        Settings
      </p>
      <div className="p-3 flex flex-col gap-5 sm:gap-10 text-sm">
        <Appearance />
        {/* <p>Unshare</p>
        <p>Language</p>
        <p>Upgrade plan</p> */}

        <div className="flex items-center justify-between md:px-[10%]">
          <SignOutButton redirectUrl="/">
            <Button className="p-2" variant={"destructive"}>
              Log out
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default Settings;

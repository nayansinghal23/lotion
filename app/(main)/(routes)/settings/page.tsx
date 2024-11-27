"use client";
import { redirect } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useConvexAuth } from "convex/react";
import { SignOutButton } from "@clerk/clerk-react";

import Appearance from "../_components/appearance";
import Unshare from "../_components/unshare";
import UpgradePlan from "../_components/upgrade-plan";
import ActivePlan from "../_components/active-plan";
import LanguageSelector from "../_components/language-selector";
import { Button } from "@/components/ui/button";

const Settings = () => {
  const { isAuthenticated } = useConvexAuth();
  const { t } = useTranslation();
  const { page_title, log_out }: any = t("settings");

  if (!isAuthenticated) {
    return redirect("/");
  }

  return (
    <div className="dark:bg-[#1F1F1F] h-full w-full">
      <p className="p-[7.5px] border-b dark:border-b-white border-b-black min-h-11 fixed top-0 w-full z-[99998] dark:bg-[#1F1F1F] bg-white flex items-center">
        {page_title}
      </p>
      <div className="p-3 flex flex-col gap-5 sm:gap-10 text-sm mt-11">
        <Appearance />
        <Unshare />
        <ActivePlan />
        <UpgradePlan />
        <LanguageSelector />
        <div className="flex items-center justify-between md:px-[10%]">
          <SignOutButton redirectUrl="/">
            <Button className="p-2" variant={"destructive"}>
              {log_out}
            </Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default Settings;

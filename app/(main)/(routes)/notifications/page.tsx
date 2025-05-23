"use client";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { Bell } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useEffect } from "react";

const Notifications = () => {
  const { t } = useTranslation();
  const { title }: any = t("notifications");
  const { isAuthenticated } = useConvexAuth();
  const notifications = useQuery(api.users.getNotifications);
  const toggleSeen = useMutation(api.users.toggleSeen);

  useEffect(() => {
    toggleSeen();
  }, []);

  if (!isAuthenticated) return redirect("/");

  if (notifications && notifications.length === 0)
    return (
      <div className="h-full w-full flex flex-col gap-2 items-center justify-center">
        <Bell size={100} />
        <p>Your notifications live here</p>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col gap-2 mt-11">
      <p className="p-[7.5px] font-semibold text-xl border-b border-b-black dark:border-b-white fixed top-0 dark:bg-[#1F1F1F] z-[99998] bg-white w-full">
        {title}
      </p>
      {Array.isArray(notifications) &&
        notifications.map(({ time, title, url }, index: number) => (
          <div key={index} className="w-full flex flex-col gap-1 py-2 sm:px-4">
            <div className="flex gap-3 items-center">
              <Image
                src={url}
                alt="user"
                width={40}
                height={40}
                className="w-10 h-10 p-0.5 rounded-full border border-black dark:border-white"
                priority
              />
              <p className="">{title}</p>
            </div>
            <p className="text-xs px-2 text-right">⌚{time}</p>
          </div>
        ))}
    </div>
  );
};

export default Notifications;

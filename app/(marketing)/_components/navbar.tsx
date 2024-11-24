"use client";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { useConvexAuth, useMutation } from "convex/react";
import { SignInButton, useUser } from "@clerk/clerk-react";

import { ModeToggle } from "@/components/mode-toggle";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import useScrollTop from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { t } = useTranslation();
  const { log_in }: any = t("marketing");
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { user } = useUser();
  const scrolled = useScrollTop();
  const addNewUser = useMutation(api.users.addNewUser);

  useEffect(() => {
    if (isAuthenticated && user) {
      addNewUser({
        userId: user.id,
        name: user.firstName
          ? user.firstName
          : user.fullName
            ? user.fullName
            : "",
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      });
    }
  }, [isAuthenticated]);

  return (
    <div
      className={cn(
        "dark:bg-[#1F1F1F] z-50 bg-background fixed top-0 flex items-center justify-between w-full p-4",
        scrolled && "border-b shadow-sm"
      )}
    >
      <h1>Jotion</h1>
      <div className="flex items-center gap-4">
        {isLoading && <Spinner />}
        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                {log_in}
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && user && (
          <>
            <Image
              src={user.imageUrl}
              alt="user-img"
              className="object-contain rounded-full"
              width={28}
              height={28}
              priority
            />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;

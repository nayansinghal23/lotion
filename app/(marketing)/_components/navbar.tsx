"use client";
import { ModeToggle } from "@/components/mode-toggle";
import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import useScrollTop from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";
import Link from "next/link";

const Navbar = () => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const scrolled = useScrollTop();

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
                Log in
              </Button>
            </SignInButton>
          </>
        )}
        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/documents"></Link>
            </Button>
            <UserButton />
          </>
        )}
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;

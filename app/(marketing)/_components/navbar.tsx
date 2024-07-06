"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import useScrollTop from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";

const Navbar = () => {
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
        <ModeToggle />
        <Button variant="outline">Login</Button>
      </div>
    </div>
  );
};

export default Navbar;

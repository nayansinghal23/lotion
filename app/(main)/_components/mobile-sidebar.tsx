import { ChevronsLeftIcon } from "lucide-react";
import Navigation from "./navigation";

import { IMobileSidebar } from "@/interfaces/interface";

const MobileSidebar = ({ setShowMobileSidebar }: IMobileSidebar) => {
  const miniminze = () => {
    setShowMobileSidebar(false);
  };

  return (
    <div className="absolute h-full bg-neutral-300 p-1 z-[99999] dark:bg-[#2b2929] w-60 flex flex-col items-end">
      <ChevronsLeftIcon className="h-6 w-6" onClick={miniminze} />
      <Navigation minimize={miniminze} />
    </div>
  );
};

export default MobileSidebar;

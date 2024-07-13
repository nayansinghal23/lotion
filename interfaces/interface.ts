import { LucideIcon } from "lucide-react";
import React from "react";

import { Id } from "@/convex/_generated/dataModel";

export interface INavigation {
  minimize: () => void;
}

export interface IMobileSidebar {
  setShowMobileSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ItemProps {
  id?: Id<"documents">;
  documentIcon?: string;
  active?: boolean;
  expanded?: boolean;
  isSearch?: boolean;
  level?: number;
  onExpand?: () => void;
  label: string;
  onClick: () => void;
  icon: LucideIcon;
}

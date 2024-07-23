import { LucideIcon } from "lucide-react";
import React from "react";

import { Doc, Id } from "@/convex/_generated/dataModel";

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
  onClick?: () => void;
  icon: LucideIcon;
}

export interface DocumentListProps {
  parentDocumentId?: Id<"documents">;
  level?: number;
  data?: Doc<"documents">[];
}

export interface ConfirmModalProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

export interface BannerProps {
  documentId: Id<"documents">;
}

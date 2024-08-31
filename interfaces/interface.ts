import React from "react";
import { DropzoneOptions } from "react-dropzone";
import { LucideIcon } from "lucide-react";

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

export interface IDocumentNavbar {
  title: string;
  editedBy: string;
}

export interface ToolbarProps {
  initialData: Doc<"documents">;
  preview?: boolean;
}

export interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}

export interface CoverImageModalProps {
  children: React.ReactNode;
  asChild?: boolean;
  id: Id<"documents">;
}

export interface SingleImageDropzoneProps {
  width?: number;
  height?: number;
  className?: string;
  value?: File | string;
  onChange?: (file?: File) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
}

export interface CoverProps {
  url: string;
  preview?: boolean;
  id: Id<"documents">;
}

export interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

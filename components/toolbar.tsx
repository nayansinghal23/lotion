import { ImageIcon, Smile, X } from "lucide-react";
import { useMutation } from "convex/react";

import { ToolbarProps } from "@/interfaces/interface";
import { api } from "@/convex/_generated/api";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import CoverImageModal from "./modals/cover-image-modal";

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const modifyIcon = useMutation(api.documents.modifyIcon);
  const selectIcon = (icon: string) => {
    modifyIcon({
      id: initialData._id,
      icon,
    });
  };

  const deleteIcon = () => {
    modifyIcon({
      id: initialData._id,
      icon: "",
    });
  };

  return (
    <div className="pl-[54px] group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker onChange={selectIcon}>
            <p className="text-6xl hover:opacity-75 transition">
              {initialData.icon}
            </p>
          </IconPicker>
          <Button
            onClick={deleteIcon}
            className="rounded-full opacity-0 hover:opacity-100 transition text-muted-foreground text-xs"
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      {!!initialData.icon && preview && (
        <p className="text-6xl pt-6">{initialData.icon}</p>
      )}
      <div className="flex gap-x-1 py-4">
        {!initialData.icon && !preview && (
          <IconPicker asChild onChange={selectIcon}>
            <Button
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        )}
        {!initialData.coverImage && !preview && (
          <CoverImageModal asChild id={initialData._id}>
            <Button
              className="to-muted-foreground text-xs"
              variant="outline"
              size="sm"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Add cover
            </Button>
          </CoverImageModal>
        )}
      </div>
    </div>
  );
};

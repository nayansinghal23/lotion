import { ImageIcon, Smile, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation } from "convex/react";

import { ToolbarProps } from "@/interfaces/interface";
import { api } from "@/convex/_generated/api";
import { IconPicker } from "./icon-picker";
import { Button } from "./ui/button";
import CoverImageModal from "./modals/cover-image-modal";

export const Toolbar = ({ initialData, preview }: ToolbarProps) => {
  const { t } = useTranslation();
  const { add_icon, add_cover }: any = t("documentId");
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
    <div className="group relative">
      {!!initialData.icon && !preview && (
        <div className="flex items-center gap-x-2 group/icon p-4">
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
        <p className="text-6xl p-4">{initialData.icon}</p>
      )}
      {(!initialData.icon || !initialData.coverImage) && !preview && (
        <div className="flex gap-x-1 p-4">
          {!initialData.icon && !preview && (
            <IconPicker asChild onChange={selectIcon}>
              <Button
                className="text-muted-foreground text-xs"
                variant="outline"
                size="sm"
              >
                <Smile className="h-4 w-4 mr-2" />
                {add_icon}
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
                {add_cover}
              </Button>
            </CoverImageModal>
          )}
        </div>
      )}
    </div>
  );
};

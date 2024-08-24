import Image from "next/image";
import { useMutation } from "convex/react";
import { X } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { CoverProps } from "@/interfaces/interface";
import { cn } from "@/lib/utils";
import { useEdgeStore } from "@/lib/edgestore";
import { Button } from "./ui/button";

const Cover = ({ url, preview, id }: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const modifyCoverImage = useMutation(api.documents.modifyCoverImage);

  const onRemove = async () => {
    await edgestore.publicFiles.delete({
      url,
    });
    modifyCoverImage({
      id,
      coverImage: "",
    });
  };

  return (
    <div
      className={cn(
        "relative w-full h-[35vh]",
        !url && "h-[12vh]",
        url && "bg-muted"
      )}
    >
      {!!url && (
        <Image src={url} alt="cover" fill priority className="object-cover" />
      )}
      {url && !preview && (
        <div className="absolute bottom-5 right-5 flex items-center gap-x-2">
          <Button
            onClick={onRemove}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cover;

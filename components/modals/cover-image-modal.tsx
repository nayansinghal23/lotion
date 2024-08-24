import { useState } from "react";
import { useMutation } from "convex/react";
import {
  AlertDialogHeader,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
} from "../ui/alert-dialog";

import { api } from "@/convex/_generated/api";
import { CoverImageModalProps } from "@/interfaces/interface";
import { useEdgeStore } from "@/lib/edgestore";
import { SingleImageDropzone } from "../single-image-dropzone";
import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

const CoverImageModal = ({ asChild, children, id }: CoverImageModalProps) => {
  const { edgestore } = useEdgeStore();
  const modifyCoverImage = useMutation(api.documents.modifyCoverImage);

  const [file, setFile] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const response = await edgestore.publicFiles.upload({
        file,
      });
      modifyCoverImage({
        id,
        coverImage: response.url,
      });
      onClose();
    }
  };

  const onClose = () => {
    setFile(undefined);
    setIsSubmitting(false);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={asChild}>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-lg font-semibold">
            Cover Image
          </AlertDialogTitle>
        </AlertDialogHeader>
        <SingleImageDropzone
          className="w-full outline-none"
          height={300}
          disabled={isSubmitting}
          value={file}
          onChange={onChange}
        />
        <AlertDialogDescription></AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
            Cancel
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CoverImageModal;

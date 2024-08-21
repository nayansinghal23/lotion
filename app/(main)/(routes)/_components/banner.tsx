import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import { BannerProps } from "@/interfaces/interface";
import { api } from "@/convex/_generated/api";
import ConfirmModal from "@/components/modals/confirm-modal";

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const remove = useMutation(api.documents.remove);
  const restore = useMutation(api.documents.restore);

  const onRemove = () => {
    const today = new Date();
    const indexOf = today.toString().indexOf("GMT") - 1;
    const promise = remove({
      id: documentId,
      notification: {
        time: `${today.toString().slice(0, indexOf)}`,
        title: ``,
        url: ``,
      },
    });
    toast.promise(promise, {
      loading: "Deleting note...",
      success: "Note deleted!",
      error: "Failed to delete note.",
    });
    router.push("/documents");
  };

  const onRestore = () => {
    const promise = restore({
      id: documentId,
    });
    toast.promise(promise, {
      loading: "Restoring note...",
      success: "Note restored!",
      error: "Failed to restore note.",
    });
  };

  return (
    <div className="w-full bg-red-500 text-center text-sm p-2 text-white flex items-center justify-center gap-x-2">
      <p>This page is in the Trash</p>
      <div
        onClick={onRestore}
        className="border-white rounded-md bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal border border-input hover:text-accent-foreground cursor-pointer"
      >
        Restore page
      </div>
      <ConfirmModal onConfirm={onRemove}>
        <div className="border-white rounded-md bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal border border-input hover:text-accent-foreground cursor-pointer">
          Delete forever
        </div>
      </ConfirmModal>
    </div>
  );
};

export default Banner;

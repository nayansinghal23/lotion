import { useState } from "react";
import { LineChart } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IDocumentNavbar } from "@/interfaces/interface";
import { useUser } from "@clerk/clerk-react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import Chart from "./chart";

const DocumentNavbar = ({ title, editedBy, views }: IDocumentNavbar) => {
  const { t } = useTranslation();
  const { share }: any = t("documentId");
  const chart: any = t("chart");
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const documentId = params.documentId;
  const document = useQuery(api.documents.getDocument, {
    id: documentId as Id<"documents">,
  });
  const displaySubscription = useQuery(api.users.displaySubscription, {});
  const addSharedMail = useMutation(api.documents.addSharedMail);

  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);

  const validateEmail = (email: string) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const onSend = async () => {
    if (!user || !document) {
      router.push("/");
      return;
    }
    if (!email) {
      setError("No email found!");
      return;
    }
    if (!validateEmail(email)) {
      setError("Email is incorrect!");
      return;
    }
    if (!displaySubscription || typeof displaySubscription === "string") {
      setError("Limited exceeded. Visit plans.");
      return;
    }
    const docs = displaySubscription.docIds.filter(
      (q) => q.id === document._id
    );
    const sharingLimit: number =
      displaySubscription.limits === 5
        ? 3
        : displaySubscription.limits === 40
          ? 50
          : Infinity;
    if (docs.length === 0) {
      setError("Can share only your document.");
      return;
    }
    if (docs[0].shared >= sharingLimit) {
      setError("Limited exceeded. Visit plans.");
      return;
    }
    try {
      setError("");
      setIsSending(true);
      const today = new Date();
      const indexOf = today.toString().indexOf("GMT") - 1;
      const shared = addSharedMail({
        id: document._id,
        to: email,
        toNotification: {
          time: `${today.toString().slice(0, indexOf)}`,
          title: `👋 ${user.fullName} is ready to work with ${email} on ${document.title} in Lotion`,
          url: user.imageUrl,
        },
        fromNotification: {
          time: `${today.toString().slice(0, indexOf)}`,
          title: `Shared ${document.title} to ${email}`,
          url: user.imageUrl,
        },
      });
      setEmail("");
      setOpen(false);
      setIsSending(false);
      toast.promise(shared, {
        loading: "Sharing document...",
        success: "Document shared!",
        error: "Failed to share document.",
      });
    } catch (error) {
      setEmail("");
      setOpen(false);
      setIsSending(false);
      console.log(error);
    }
  };

  return (
    <div className="min-h-[44px] border-b border-b-black dark:border-b-yellow-50 px-3 py-1 flex gap-1 items-center justify-between">
      <span className="whitespace-nowrap overflow-hidden text-ellipsis flex-1">
        {title}
      </span>
      <div className="flex items-center gap-2">
        <Dialog open={open}>
          <DialogTrigger asChild onClick={() => setOpen(true)}>
            <span className="cursor-pointer hover:bg-primary/5 px-2 py-1 rounded">
              {share.button}
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{share.title}</DialogTitle>
              <DialogDescription>{share.description}</DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder={share.placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-md"
              />
            </div>
            {error && <span className="text-red-400">{error}</span>}
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant="secondary"
                className="w-max"
                onClick={onSend}
                disabled={isSending}
              >
                {share.send}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="w-max"
                disabled={isSending}
                onClick={() => {
                  setEmail("");
                  setError("");
                  setOpen(false);
                }}
              >
                {share.cancel}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {editedBy !== "" && (
          <div className="flex items-center gap-2">
            <span>{share.edited_by}</span>
            <Image
              src={editedBy}
              alt="user-img"
              className="object-contain rounded-full"
              width={20}
              height={20}
              priority
            />
          </div>
        )}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center justify-center cursor-pointer hover:bg-primary/5 px-2 py-1 rounded">
            <LineChart />
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{chart.title}</DialogTitle>
            <DialogDescription>{chart.description}</DialogDescription>
          </DialogHeader>
          <Chart views={views} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentNavbar;

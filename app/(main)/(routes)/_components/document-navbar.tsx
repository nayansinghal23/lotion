import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import Image from "next/image";

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
import { useParams, useRouter } from "next/navigation";
import sendMail from "@/actions/mail";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

const DocumentNavbar = ({ title, editedBy }: IDocumentNavbar) => {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const documentId = params.documentId;
  const document = useQuery(api.documents.getDocument, {
    id: documentId as Id<"documents">,
  });
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
    try {
      setError("");
      setIsSending(true);
      const href: string = "http://localhost:3000/documents/" + document._id;
      const mail = await sendMail(
        email,
        `👋 ${user.fullName} is ready to work with you on ${document.title} in Lotion`,
        `<h1>Take a look at ${user.fullName}'s page <a href=${href}>${document.title}</a></h1>`,
        user.emailAddresses[0].emailAddress
      );
      // const shared = addSharedMail({
      //   id: document._id,
      //   to: email,
      // });
      setEmail("");
      setOpen(false);
      setIsSending(false);
      // toast.promise(shared, {
      //   loading: "Sharing document...",
      //   success: "Document shared!",
      //   error: "Failed to share document.",
      // });
    } catch (error) {
      setEmail("");
      setOpen(false);
      setIsSending(false);
      console.log(error);
    }
  };

  return (
    <div className="px-3 py-1 flex items-center justify-between">
      <span>{title}</span>
      <div className="flex items-center gap-2">
        <Dialog open={open}>
          <DialogTrigger asChild onClick={() => setOpen(true)}>
            <span className="cursor-pointer hover:bg-primary/5 px-2 py-1 rounded">
              Share
            </span>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Email address</DialogTitle>
              <DialogDescription>
                Type the email-id whom you want to share with.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                placeholder="example@gmail.com"
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
                Send
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
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {editedBy !== "" && (
          <div className="flex items-center gap-2">
            <span>Edited by</span>
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
    </div>
  );
};

export default DocumentNavbar;

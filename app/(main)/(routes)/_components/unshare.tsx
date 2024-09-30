import { useState } from "react";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const Unshare = () => {
  const [processing, setProcessing] = useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);
  const [updates, setUpdates] = useState<string[]>([]);
  const email = useMutation(api.documents.getEmails);
  const unshare = useMutation(api.documents.addUnsharedMail);

  const displayEmails = () => {
    if (!documentId) return;
    setProcessing(true);
    setError("");
    setEmails([]);
    email({
      id: documentId as Id<"documents">,
    })
      .then((emails) => {
        if (typeof emails !== "string") {
          if (emails.length === 1) {
            setError("Document already unshared");
            setDocumentId("");
          } else {
            setEmails(emails);
            setUpdates(emails);
          }
        } else {
          setError(emails);
        }
        setProcessing(false);
      })
      .catch((err) => {
        setError("Invalid document id");
        setProcessing(false);
      });
  };

  const toggleCheckBox = (email: string, value: boolean) => {
    if (value) {
      setUpdates((prev) => [...prev, email]);
    } else {
      setUpdates((prev) => {
        return prev.filter((item) => item !== email);
      });
    }
  };

  const handleUnshare = () => {
    if (updates.length === emails.length) return;
    setProcessing(true);
    setError("");
    try {
      const promise = unshare({
        id: documentId as Id<"documents">,
        emails: updates,
      });
      toast.promise(promise, {
        loading: "Unsharing...",
        success: "Unshared",
        error: "Failed to unshare.",
      });
      setProcessing(false);
      setEmails([]);
      setUpdates([]);
      setDocumentId("");
    } catch (error) {
      setError("Error occurred!");
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 md:px-[10%]">
      <div className="w-full">
        <p className="sm:font-semibold">Unshare</p>
        <p className="hidden sm:block">
          Take away the access of your document.
        </p>
      </div>
      <div className="w-full flex items-center justify-between gap-2">
        <Input
          type="text"
          className="w-[60%]"
          placeholder="Document Id..."
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          disabled={processing}
        />
        <Button onClick={displayEmails} disabled={processing}>
          Find
        </Button>
      </div>
      {error && <p className="text-red-400 w-full">{error}</p>}
      {emails.length >= 2 && !error && (
        <div className="w-full flex flex-col gap-1 items-end">
          <div className="w-full flex flex-col gap-1 h-[150px] overflow-auto border border-black dark:border-white p-3 rounded-lg">
            {emails.map((email: string, index: number) => (
              <div
                key={index}
                className="w-full flex items-center justify-between"
              >
                <p className="overflow-hidden text-ellipsis">{email}</p>
                <Checkbox
                  checked={index === 0 ? true : updates.includes(email)}
                  onCheckedChange={(e) => {
                    index !== 0 && toggleCheckBox(email, Boolean(e.valueOf()));
                  }}
                  disabled={index === 0 ? true : processing}
                />
              </div>
            ))}
          </div>
          <Button
            disabled={processing}
            className="w-max mt-1"
            onClick={handleUnshare}
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Unshare;

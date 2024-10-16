"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

const DocumentsPage = () => {
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  const updatingDocIds = useMutation(api.users.updatingDocIds);
  const displaySubscription = useQuery(api.users.displaySubscription, {});

  const onCreate = () => {
    if (
      !displaySubscription ||
      typeof displaySubscription === "string" ||
      displaySubscription.docIds.length >= displaySubscription.limits
    ) {
      toast.promise(new Promise((resolve, reject) => resolve("")), {
        loading: "Creating a new note...",
        success: "Limited exceeded. Visit plans.",
        error: "Failed to create a new note.",
      });
      return;
    }
    const today = new Date();
    const indexOf = today.toString().indexOf("GMT") - 1;
    const data = create({
      title: "Untitled",
      time: `${today.toString().slice(0, indexOf)}`,
    });
    data.then((id) => {
      updatingDocIds({
        id,
        type: "create",
      });
      toast.promise(data, {
        loading: "Creating a new note...",
        success: "New note created!",
        error: "Failed to create a new note.",
      });
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
      <h2 className="text-lg font-medium">
        Welcome to {user?.firstName}&apos;s Jotion{" "}
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle className="h-4 w-4 mr-2" />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPage;

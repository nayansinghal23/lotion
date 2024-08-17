"use client";
import { ReactNode } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import DocumentNavbar from "../../_components/document-navbar";

const DocumentIdLayout = ({ children }: { children: ReactNode }) => {
  const params = useParams();
  const documentId = params.documentId;
  const document = useQuery(api.documents.getDocument, {
    id: documentId as Id<"documents">,
  });

  if (!document || document.isArchived)
    return <div className="w-full h-full">{children}</div>;

  return (
    <div className="w-full h-full">
      <DocumentNavbar
        title={document.title}
        editedBy={
          document.shared.length > 1 && document.lastEditedBy
            ? document.lastEditedBy
            : ""
        }
      />
      {children}
    </div>
  );
};

export default DocumentIdLayout;

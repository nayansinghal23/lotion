"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import Cover from "@/components/cover";
import Editor from "@/components/editor";
import Banner from "../../_components/banner";

const DocumentIdPage = () => {
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId;
  const document = useQuery(api.documents.getDocument, {
    id: documentId as Id<"documents">,
  });
  const modifyContent = useMutation(api.documents.modifyContent);
  const modifyTitle = useMutation(api.documents.modifyTitle);
  const [title, setTitle] = useState<string>("");

  const onChange = (content: string) => {
    if (content && document) {
      modifyContent({
        id: document._id,
        content,
      });
    }
  };

  const handleTitleChange = (e: any) => {
    if (e.target.value === "") {
      modifyTitle({
        id: documentId as Id<"documents">,
        title: "Untitled",
      });
    } else {
      modifyTitle({
        id: documentId as Id<"documents">,
        title: e.target.value,
      });
    }
    setTitle(e.target.value);
  };

  if (!document)
    return (
      <>
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <p>This content does not exist</p>
          <div
            role="button"
            className="w-max cursor-pointer flex justify-center items-center rounded bg-[#2379E2] text-white px-3 py-2 text-sm font-medium"
            onClick={() => {
              router.push("/documents");
            }}
          >
            Back to my content
          </div>
        </div>
      </>
    );

  return (
    <>
      {document.isArchived && <Banner documentId={document._id} />}
      <Cover
        url={document.coverImage ? document.coverImage : ""}
        id={document._id}
      />
      <div className="w-full">
        <Toolbar initialData={document} />
      </div>
      <div className="w-full h-full px-4">
        <input
          className="text-3xl font-bold focus:outline-none dark:bg-[#1f1f1f] w-full"
          placeholder="Untitled"
          value={
            title === ""
              ? document.title === "Untitled"
                ? ""
                : document.title
              : title
          }
          onChange={handleTitleChange}
        />
        <Editor onChange={onChange} initialContent={document.content} />
      </div>
    </>
  );
};

export default DocumentIdPage;

"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/components/toolbar";
import Cover from "@/components/cover";
import Editor from "@/components/editor";
import Banner from "../../_components/banner";

const DocumentIdPage = () => {
  const { t } = useTranslation();
  const { back, not_exist }: any = t("documentId");
  const params = useParams();
  const router = useRouter();
  const documentId = params.documentId;
  const document = useQuery(api.documents.getDocument, {
    id: documentId as Id<"documents">,
  });
  const displaySubscription = useQuery(api.users.displaySubscription, {});
  const modifyContent = useMutation(api.documents.modifyContent);
  const modifyTitle = useMutation(api.documents.modifyTitle);
  const paymentTimesUp = useMutation(api.users.paymentTimesUp);
  const [title, setTitle] = useState<string>("");
  const [expired, setExpired] = useState<boolean>(false);
  const ref = useRef(true);

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

  const checkSubscription = () => {
    if (
      !displaySubscription ||
      !document ||
      typeof displaySubscription === "string" ||
      displaySubscription.plans_purchased.length === 0
    )
      return;
    const timeline = new Date(
      displaySubscription.plans_purchased[0].purchased_at
    );
    const extraTime = new Date(
      displaySubscription.plans_purchased[0].purchased_at
    );
    if (
      displaySubscription.plans_purchased[0].plan_type !== "free" &&
      displaySubscription.plans_purchased[0].status
    ) {
      if (displaySubscription.plans_purchased[0].plan_type === "monthly") {
        timeline.setDate(timeline.getDate() + 30);
        extraTime.setDate(extraTime.getDate() + 31);
      } else if (
        displaySubscription.plans_purchased[0].plan_type === "yearly"
      ) {
        timeline.setDate(timeline.getDate() + 365);
        extraTime.setDate(extraTime.getDate() + 366);
      }

      if (extraTime < new Date()) {
        const today = new Date();
        const indexOf = today.toString().indexOf("GMT") - 1;
        setExpired(false);
        paymentTimesUp({
          time: `${today.toString().slice(0, indexOf)}`,
        });
      } else if (timeline <= new Date() && timeline <= extraTime) {
        /*
         Edge Cases :- 
         1) If user pays again.
         2) User doesn't pay then goto the above if clause and delete the extra files & shares. 
        */
        setExpired(true);
      }
    }
  };

  useEffect(() => {
    if (ref.current) {
      checkSubscription();
      ref.current = false;
    }
  }, []);

  if (!document)
    return (
      <>
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <p>{not_exist}</p>
          <div
            role="button"
            className="w-max cursor-pointer flex justify-center items-center rounded bg-[#2379E2] text-white px-3 py-2 text-sm font-medium"
            onClick={() => {
              router.push("/documents");
            }}
          >
            {back}
          </div>
        </div>
      </>
    );

  return (
    <>
      {expired ? (
        <Banner
          title="Pay within 24 hours else history will be lost"
          documentId={document._id}
        />
      ) : (
        document.isArchived && (
          <Banner
            title="This page is in the Trash"
            documentId={document._id}
            showRestoreBtn
            showDeleteBtn
          />
        )
      )}
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
        <Editor
          onChange={onChange}
          initialContent={document.content}
          shared={document.shared}
        />
      </div>
    </>
  );
};

export default DocumentIdPage;

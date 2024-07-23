import { useMutation, useQuery } from "convex/react";
import { ChevronRightIcon, LucideX } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectedDocumentId,
  selectedDocumentIdSelector,
} from "@/redux/selectedDocumentIdSlice";
import { Id } from "@/convex/_generated/dataModel";
import { toggleMoveToModal } from "@/redux/moveToSlice";

const MoveTo = () => {
  const dispatch = useAppDispatch();
  const selector = useAppSelector(selectedDocumentIdSelector);
  const documents = useQuery(api.documents.getMoveTo, {
    id: selector.currentId,
  });
  const moveTo = useMutation(api.documents.moveTo);
  const showRootLevel = useQuery(api.documents.getRootLevel, {
    id: selector.currentId,
  });

  const handleMoveTo = (parentId: Id<"documents"> | undefined) => {
    if (selector.currentId) {
      moveTo({
        id: selector.currentId,
        parentId,
      })
        .then(() => {
          dispatch(toggleMoveToModal(false));
          dispatch(selectedDocumentId(undefined));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  if (!documents) return <p>Loading...</p>;

  return (
    <div
      id="moveTo"
      className="absolute top-[50%] left-[50%] rounded-md bg-[#DCD9D9] dark:bg-[#353232] backdrop-filter-none overflow-hidden z-[99999]"
    >
      <div
        className="w-full flex justify-end p-1 hover:cursor-pointer"
        onClick={() => dispatch(toggleMoveToModal(false))}
      >
        <LucideX className="w-6 h-6" />
      </div>
      <p className="text-xs leading-4 whitespace-nowrap overflow-hidden text-ellipsis pl-6 py-2">
        Suggested
      </p>
      {showRootLevel && (
        <div
          className="py-2 px-6 hover:bg-neutral-300 hover:dark:bg-neutral-600"
          onClick={() => handleMoveTo(undefined)}
        >
          <p>Move to root level</p>
        </div>
      )}
      {documents.length === 0 ? (
        <p className="py-2 px-6 text-center">No suggested documents😥</p>
      ) : (
        <div className="overflow-y-auto max-h-[160px]">
          {documents.map((document) => (
            <div
              key={document._id}
              className="py-2 px-6 hover:bg-neutral-300 hover:dark:bg-neutral-600 flex items-center gap-2"
              onClick={() => handleMoveTo(document._id)}
            >
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              <p className="whitespace-nowrap overflow-hidden text-ellipsis">
                {document.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MoveTo;

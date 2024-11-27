import { MouseEvent } from "react";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Move,
  Plus,
  Trash,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@clerk/clerk-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { ItemProps } from "@/interfaces/interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/redux/hooks";
import { toggleMoveToModal } from "@/redux/moveToSlice";
import { selectedDocumentId } from "@/redux/selectedDocumentIdSlice";

const Item = ({
  id,
  label,
  onClick,
  icon: Icon,
  active,
  documentIcon,
  isSearch,
  level = 0,
  onExpand,
  expanded,
}: ItemProps) => {
  const dispatch = useAppDispatch();
  const { user } = useUser();
  const { t } = useTranslation();
  const { notifications }: any = t("navigation");
  const create = useMutation(api.documents.create);
  const archive = useMutation(api.documents.archive);
  const unseen = useQuery(api.users.displayUnseen);
  const updatingDocIds = useMutation(api.users.updatingDocIds);
  const displaySubscription = useQuery(api.users.displaySubscription, {});
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;

  const handleExpand = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    onExpand?.();
  };

  const handleAddSubPages = (event: MouseEvent<HTMLDivElement>) => {
    if (!id) return;
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
    event.stopPropagation();
    const today = new Date();
    const indexOf = today.toString().indexOf("GMT") - 1;
    const promise = create({
      title: "Untitled",
      parentDocument: id,
      time: `${today.toString().slice(0, indexOf)}`,
    })
      .then((documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        updatingDocIds({
          id: documentId,
          type: "create",
        });
        toast.promise(promise, {
          loading: "Creating a new note...",
          success: "New note created!",
          error: "Failed to create a new note.",
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onArchive = (event: MouseEvent<HTMLDivElement>) => {
    if (!id) return;
    event.stopPropagation();
    const promise = archive({
      id,
    });
    toast.promise(promise, {
      loading: "Moving to trash...",
      success: "Note moved to trash!",
      error: "Failed to archive note.",
    });
  };

  const moveTo = (event: MouseEvent<HTMLDivElement>) => {
    if (!id) return;
    event.stopPropagation();
    dispatch(toggleMoveToModal(true));
    dispatch(selectedDocumentId(id));
  };

  return (
    <div
      onClick={onClick}
      role="button"
      style={{ paddingLeft: level ? `${level * 12 + 12}px` : "12px" }}
      className={cn(
        "min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex items-center to-muted-foreground font-medium",
        active && "bg-primary/5 text-primary"
      )}
    >
      {!!id && (
        <div
          role="button"
          className="h-full rounded-sm hover:bg-neutral-300 dark:bg-neutral-600 mr-1"
          onClick={handleExpand}
        >
          <ChevronIcon className="h-4 w-4 shrink-0 text-muted-foreground/50" />
        </div>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">{documentIcon}</div>
      ) : (
        <Icon className="shrink-0 h-[18px] mr-2 text-muted-foreground" />
      )}
      <p className="truncate flex items-center justify-between w-full">
        {label} {label === notifications && <span>{unseen}</span>}
      </p>
      {isSearch && (
        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      )}
      {!!id && (
        <div className="ml-auto flex items-center gap-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                role="button"
                className="opacity-0 hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
              >
                <MoreHorizontal className="h-4 w-4 to-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-60"
              align="start"
              side="right"
              forceMount
            >
              <DropdownMenuItem onClick={onArchive}>
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={moveTo}>
                <Move className="h-4 w-4 mr-2" />
                Move to
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs to-muted-foreground p-2">
                Last edited by: {user?.fullName}{" "}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div
            className="opacity-0 hover:opacity-100 h-full ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            role="button"
            onClick={handleAddSubPages}
          >
            <Plus className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${level * 12 + 25}px` : "12px",
      }}
      className="flex gap-x-2 py-[3px]"
    >
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-[30%]" />
    </div>
  );
};

export default Item;

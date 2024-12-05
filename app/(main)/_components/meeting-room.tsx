import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutList, Users } from "lucide-react";
import {
  CallControls,
  CallingState,
  CallParticipantsList,
  CallStatsButton,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";

import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EndCallButton from "./end-call-button";
import Spinner from "@/components/spinner";

type CallLayoutType = "grid" | "speaker-left" | "speaker-right";

const MeetingRoom = () => {
  const serachParams = useSearchParams();
  const router = useRouter();
  const { useCallCallingState } = useCallStateHooks();
  const isPersonalRoom = !!serachParams.get("personal");
  const callingState = useCallCallingState();
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState<boolean>(false);

  if (callingState !== CallingState.JOINED) {
    if (callingState.toLowerCase() === "left") {
      return (
        <div
          role="button"
          className="w-max cursor-pointer flex justify-center items-center rounded bg-[#2379E2] text-white px-3 py-2 text-sm font-medium m-auto"
          onClick={() => {
            router.push("/documents");
          }}
        >
          Back to my content
        </div>
      );
    }

    return (
      <div className="h-full flex items-center justify-center m-auto">
        <Spinner size="lg" />
      </div>
    );
  }

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout />;

      case "speaker-right":
        return <SpeakerLayout participantsBarPosition={"left"} />;

      default:
        return <SpeakerLayout participantsBarPosition={"right"} />;
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden pt-4">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full items-center max-w-[1000px] text-white">
          <CallLayout />
        </div>
        <div
          className={cn("h-[calc(100vh - 86px)] hidden ml-2", {
            "show-block": showParticipants,
          })}
        >
          <CallParticipantsList onClose={() => setShowParticipants(false)} />
        </div>
      </div>

      <div className="fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap">
        <div className="text-white">
          <CallControls onLeave={() => router.push(`/documents`)} />
        </div>

        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer rounded-2xl px-4 py-2">
              <LayoutList size={20} />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent>
            {["Grid", "Speaker-Left", "Speaker-Right"].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => {
                    setLayout(item.toLowerCase() as CallLayoutType);
                  }}
                >
                  {item}
                </DropdownMenuItem>
                {index !== 2 && (
                  <DropdownMenuSeparator className="border-dark-1" />
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton />
        <button onClick={() => setShowParticipants((prev) => !prev)}>
          <div className="cursor-pointer rounded-2xl px-4 py-2">
            <Users size={20} />
          </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </div>
  );
};

export default MeetingRoom;

"use client";
import { useRouter } from "next/navigation";
import { t } from "i18next";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

import { Button } from "@/components/ui/button";

const EndCallButton = () => {
  const call = useCall();
  const router = useRouter();
  const { endAll }: any = t("meeting");
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call.state.createdBy.id;

  if (!isMeetingOwner) return null;

  return (
    <Button
      onClick={async () => {
        await call.endCall();
        router.push("/documents");
      }}
      className="bg-red-500 text-white"
    >
      {endAll}
    </Button>
  );
};

export default EndCallButton;

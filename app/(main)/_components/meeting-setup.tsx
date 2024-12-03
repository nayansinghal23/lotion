"use client";
import { useEffect, useState } from "react";
import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from "@stream-io/video-react-sdk";

import { Button } from "@/components/ui/button";
import { IMeetingSetup } from "@/interfaces/interface";

const MeetingSetup = ({ setIsSetupCompleted }: IMeetingSetup) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState<boolean>(false);
  const call = useCall();

  if (!call) return;

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-3">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview className="camera text-center" />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2.5"
        onClick={() => {
          call.join();
          setIsSetupCompleted(true);
        }}
      >
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;

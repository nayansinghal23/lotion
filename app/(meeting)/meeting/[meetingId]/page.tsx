"use client";
/**
 - Middlewares
 - Language Localization
 - Colors & Bg colors on dark & light mode
 http://localhost:3000/meeting/ee258221-5419-48fa-86c6-c5088ba13a96
 */

import { useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";

import MeetingSetup from "@/app/(main)/_components/meeting-setup";
import MeetingRoom from "@/app/(main)/_components/meeting-room";
import Spinner from "@/components/spinner";
import { useGetCallById } from "@/hooks/use-get-call-by-id";

const Meeting = () => {
  const params = useParams();
  const meetingId = params.meetingId;
  const { user, isLoaded } = useUser();
  const { call, isCallLoading } = useGetCallById(meetingId);
  const [isSetupCompleted, setIsSetupCompleted] = useState<boolean>(false);

  if (!isLoaded || isCallLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupCompleted ? (
            <MeetingSetup setIsSetupCompleted={setIsSetupCompleted} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </div>
  );
};

export default Meeting;

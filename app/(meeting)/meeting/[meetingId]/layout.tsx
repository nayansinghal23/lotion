"use client";
import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";
import "@stream-io/video-react-sdk/dist/css/styles.css";

import Spinner from "@/components/spinner";
import { StreamClientProvider } from "@/components/providers/stream-client-provider";

const MeetingLayout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return redirect("/");
  }
  return (
    <StreamClientProvider>
      <div className="w-full h-full">{children}</div>
    </StreamClientProvider>
  );
};

export default MeetingLayout;

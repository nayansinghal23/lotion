"use client";
import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";

import Spinner from "@/components/spinner";

const PaymentLayout = ({ children }: { children: React.ReactNode }) => {
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
  return <div className="w-full h-full">{children}</div>;
};

export default PaymentLayout;

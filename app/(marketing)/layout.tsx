"use client";
import React from "react";

import Navbar from "./_components/navbar";
import { useAppSelector } from "@/redux/hooks";
import { moveToSelector } from "@/redux/moveToSlice";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  const selector = useAppSelector(moveToSelector);

  return (
    <div
      className="h-full"
      style={selector.openMoveToModal ? { pointerEvents: "none" } : {}}
    >
      <Navbar />
      <main className="h-full pt-40">{children}</main>
    </div>
  );
};

export default MarketingLayout;

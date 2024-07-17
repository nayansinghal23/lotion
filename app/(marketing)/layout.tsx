"use client";
import React from "react";
import { Provider } from "react-redux";

import Navbar from "./_components/navbar";
import { store } from "@/redux/store";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <div className="h-full">
        <Navbar />
        <main className="h-full pt-40">{children}</main>
      </div>
    </Provider>
  );
};

export default MarketingLayout;

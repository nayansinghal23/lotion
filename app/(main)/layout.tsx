"use client";
import React, { useRef, useState } from "react";
import { useConvexAuth } from "convex/react";
import { redirect } from "next/navigation";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import { MenuIcon } from "lucide-react";
import { Provider } from "react-redux";

import Spinner from "@/components/spinner";
import { store } from "@/redux/store";
import SearchCommand from "@/components/search-command";
import Navigation from "./_components/navigation";
import MobileSidebar from "./_components/mobile-sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const panelRef = useRef<ImperativePanelHandle>(null);
  const [collapsible, setCollapsible] = useState<boolean>(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState<boolean>(false);
  const { isLoading, isAuthenticated } = useConvexAuth();

  const minimize = () => {
    if (panelRef.current) {
      setCollapsible(true);
      panelRef.current.collapse();
    }
  };

  const maximize = () => {
    setCollapsible(false);
  };

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
    <Provider store={store}>
      <div className="h-full flex dark:bg-[#1F1F1F]">
        <PanelGroup autoSaveId="sidebar" direction="horizontal">
          {!collapsible ? (
            <>
              <Panel
                id="panel1"
                order={1}
                ref={panelRef}
                defaultSize={24}
                minSize={24}
                maxSize={48}
                className="hidden md:block"
                collapsible={collapsible}
              >
                <Navigation minimize={minimize} />
              </Panel>
              <PanelResizeHandle className="hidden md:block w-[1px] bg-[#b7a0a0]" />
            </>
          ) : (
            <div onClick={maximize}>
              <MenuIcon
                role="button"
                className="h-6 w-6 text-muted-foreground hidden md:block"
              />
            </div>
          )}
          <div className="md:hidden relative">
            {showMobileSidebar ? (
              <MobileSidebar setShowMobileSidebar={setShowMobileSidebar} />
            ) : (
              <MenuIcon
                onClick={() => setShowMobileSidebar(true)}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </div>
          <Panel id="panel2" order={2}>
            <main className="flex-1 h-full overflow-y-auto">
              <SearchCommand />
              {children}
            </main>
          </Panel>
        </PanelGroup>
      </div>
    </Provider>
  );
};

export default MainLayout;

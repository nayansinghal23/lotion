import React from "react";

export interface INavigation {
  minimize: () => void;
}

export interface IMobileSidebar {
  setShowMobileSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

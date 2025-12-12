"use client";

import dynamic from "next/dynamic";

const EditorWrapper = dynamic(() => import("./editor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-[80vh]">
      Loading editor...
    </div>
  ),
});

export default EditorWrapper;

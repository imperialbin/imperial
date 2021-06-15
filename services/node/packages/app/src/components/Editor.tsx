import React from "react";
import dynamic from "next/dynamic";

const AceEditor = dynamic(() => import("react-ace"), { ssr: false });

export const Editor = () => {
  return <AceEditor height="100vh" width="100vw" />;
};

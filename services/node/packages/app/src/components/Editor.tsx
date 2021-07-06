import React from "react";
import dynamic from "next/dynamic";

dynamic(async () => import("ace-builds/src-min-noconflict/theme-imperial"), { ssr: false });

const AceEditor = dynamic(async () => import("react-ace"), { ssr: false });

export const Editor = () => {
  return <AceEditor theme="imperial" height="100vh" width="100vw" />;
};

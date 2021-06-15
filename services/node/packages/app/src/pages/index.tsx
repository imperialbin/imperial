import { Box, Heading, Kbd } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Ambient TypeScript import only
import type { HelloResponseType } from "./api/hello";
import { Editor } from "../components/Editor";
import * as imperial from "@imperial/components";

export default function Home() {
  const [data, setData] = useState<HelloResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  return (
      <Editor />
  );
}

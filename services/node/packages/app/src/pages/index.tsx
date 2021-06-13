import { Box, Heading, Kbd } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";

// Ambient TypeScript import only
import type { HelloResponseType } from "./api/hello";

import * as imperial from "@imperial/components";

export default function Home() {
  const [data, setData] = useState<HelloResponseType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  return (
    <Box textAlign="center" paddingTop={5}>
      <Heading>Hello World</Heading>
      <imperial.Test />
    </Box>
  );
}

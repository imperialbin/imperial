import useSWR from "swr";

import { Document } from "../types";

export const useRecentDocuments = () => {
  const { data } = useSWR<{ data: Array<Document> }>(
    "/user/@me/recentDocuments"
  );

  return data?.data;
};

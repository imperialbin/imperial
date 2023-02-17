import useSWR from "swr";

import { Document } from "../types";

export const useRecentDocuments = () => {
  const { data } = useSWR<{ data: { documents: Array<Document> } }>(
    "/users/@me/recent_documents"
  );

  return data?.data?.documents ?? null;
};

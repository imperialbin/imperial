import useSWR from "swr";

import { Document } from "../types";

export const useRecentDocuments = () => {
  const { data } = useSWR<{ data: Array<Document> }>("/users/@me/recent");

  return data?.data ?? null;
};

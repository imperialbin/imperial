import useSWR from "swr";

import { Document } from "../types";
import { FULL_URI_V1 } from "../utils/consts";

export const useRecentDocuments = () => {
  const { data, error, mutate } = useSWR(
    FULL_URI_V1 + "/user/@me/recentDocuments"
  );
  const documents: Array<Document> = data?.data;

  return {
    documents,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

import useSWR from "swr";
import { makeRequest } from "../utils/Rest";

import { Document } from "../types";

export const useDocument = (
  documentId: string | undefined
): Document | undefined => {
  if (!documentId) return;

  const { data: response, error } = useSWR(`/document/${documentId}`);

  return response?.data;
};

import useSWR from "swr";

import { Document } from "../types";

export const useDocument = (
  documentId: string | undefined,
): Document | undefined => {
  if (!documentId) return;

  const { data: response } = useSWR(`/document/${documentId}`);

  return response?.data;
};

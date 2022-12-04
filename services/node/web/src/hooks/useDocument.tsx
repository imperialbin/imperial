import { makeRequest } from "../utils/Rest";
import { FULL_URI_V1 } from "../utils/Constants";
import useSWR from "swr";

import { Document } from "../types";

export const useDocument = (
  documentId: string | undefined
): Document | undefined => {
  if (!documentId) return;

  const { data: response } = useSWR(
    `/document/${documentId}`,
    async (url) => await makeRequest<Document>("GET", url)
  );

  return response?.data;
};

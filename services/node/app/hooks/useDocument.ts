import useSWR from "swr";
import { Document } from "../types";
import { FULL_URI_V1 } from "../utils/consts";

export const useDocument = (URL: string) => {
  const { data, error } = useSWR(FULL_URI_V1 + `/document/${URL}`);
  const document: Document = data?.data;

  return {
    document: document,
    isLoading: !error && !data,
    isError: error,
  };
};

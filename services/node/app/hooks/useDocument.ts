import useSWR from "swr";
import { Document } from "../types";
import { FULL_URI_V1 } from "../utils/consts";

export const useDocument = (URL: string, password: string) => {
  const { data, error } = useSWR(
    URL ? FULL_URI_V1 + `/document/${URL}?password=${password}` : null
  );
  const document: Document = data?.data;

  return {
    document: document,
    isLoading: !error && !data,
    isError: error,
  };
};

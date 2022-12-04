import useSWR from "swr";
import { makeRequest } from "../utils/Rest";

import { Document } from "../types";

export const useUser = (): Document | undefined => {
  const { data: response, error } = useSWR(`/users/@me`);

  console.log(response);

  return response?.data;
};

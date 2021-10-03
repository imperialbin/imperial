import useSWR from "swr";

import { User } from "../types";
import { FULL_URI_V1 } from "../lib/constants";

export const useUser = () => {
  const { data, error, mutate } = useSWR(FULL_URI_V1 + "/user/@me");
  const user: User = data?.data;

  return {
    user: user,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

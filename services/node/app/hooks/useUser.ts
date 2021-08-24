import useSWR from "swr";
import { User } from "../types";
import { FULL_URI_V1 } from "../utils/consts";

export const useUser = () => {
  const { data, error } = useSWR(FULL_URI_V1 + "/user/@me");
  const user: User = data?.data;

  return {
    user: user,
    isLoading: !error && !data,
    isError: error,
  };
};

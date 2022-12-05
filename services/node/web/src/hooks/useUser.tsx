import useSWR from "swr";
import { makeRequest } from "../utils/Rest";

import { Document } from "../types";
import { store } from "../state";
import { setUser } from "../state/actions";

export const useUser = (): Document | undefined => {
  const { data } = useSWR(`/users/@me`);

  store.dispatch(setUser(data?.data ?? null));

  return data?.data;
};

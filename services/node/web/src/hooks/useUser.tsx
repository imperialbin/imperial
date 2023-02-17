import useSWR from "swr";

import { store } from "../state";
import { setUser } from "../state/actions";
import { SelfUser } from "../types";

export const useUser = (): SelfUser | undefined => {
  const { data } = useSWR(`/users/@me`);

  store.dispatch(setUser(data?.data ?? null));

  return data?.data;
};

import { store } from "../../state";
import { setUser } from "../../state/actions";
import { request } from "./Request";

export const fetchMe = async () => {
  const { success, data } = await request("/user/@me");
  if (!success) return; // handl ethis later

  store.dispatch(setUser(data));
};

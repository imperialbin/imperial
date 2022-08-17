import { X } from "react-feather";
import { store } from "../../state";
import { addNotification, setUser } from "../../state/actions";
import { request } from "./Request";

export const fetchMe = async () => {
  const { success, data, error } = await request("GET", "/users/@me");

  if (!success) {
    if (error?.code === 401) return;

    return store.dispatch(
      addNotification({
        icon: <X />,
        message: "There was an error retrieving your user",
        type: "error",
      }),
    );
  }

  store.dispatch(setUser(data));
};

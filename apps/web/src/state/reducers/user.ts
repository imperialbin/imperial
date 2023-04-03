import { SelfUser } from "@web/types";
import { deleteCookie } from "cookies-next";

type UserActions =
  | {
      type: "SET_USER";
      payload: SelfUser | null;
    }
  | {
      type: "LOGOUT_USER";
    };

const user = (state: SelfUser | null = null, action: UserActions) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;

    case "LOGOUT_USER":
      deleteCookie("imperial-auth");
      return null;
    default:
      return state;
  }
};

export default user;

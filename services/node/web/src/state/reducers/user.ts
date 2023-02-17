import { SelfUser } from "@/types";

type UserActions = {
  type: "SET_USER";
  payload: SelfUser | null;
};

const user = (state: SelfUser | null = null, action: UserActions) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    default:
      return state;
  }
};

export default user;

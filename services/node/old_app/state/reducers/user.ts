import { AnyAction } from "redux";
import { SelfUser } from "../../src/types";

const user = (state: SelfUser | null = null, action: AnyAction) => {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    default:
      return state;
  }
};

export default user;

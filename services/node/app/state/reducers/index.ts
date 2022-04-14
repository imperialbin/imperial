import { combineReducers } from "redux";
import { SelfUser } from "../../src/types";
import user from "./user";

export interface ImperialState {
  user: SelfUser | null;
}

export const reducers = combineReducers<ImperialState>({
  user,
});

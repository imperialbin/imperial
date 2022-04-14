import { combineReducers } from "redux";
import { SelfUser } from "../../src/types";
import modal, { ModalState } from "./modal";
import user from "./user";

export interface ImperialState {
  user: SelfUser | null;
  modal: ModalState | null;
}

export const reducers = combineReducers<ImperialState>({
  user,
  modal,
});

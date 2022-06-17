import { combineReducers } from "redux";
import { SelfUser } from "../../src/types";
import modal, { ModalState } from "./modal";
import notifications, { NotificationState } from "./notifications";
import user from "./user";

export interface ImperialState {
  user: SelfUser | null;
  modal: ModalState | null;
  notifications: NotificationState;
}

export const reducers = combineReducers<ImperialState>({
  user,
  modal,
  notifications,
});

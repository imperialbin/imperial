import { combineReducers } from "redux";
import { SelfUser } from "@/types";
import editor, { EditorState } from "./editor";
import modal, { ModalState } from "./modal";
import notifications, { NotificationState } from "./notifications";
import ui_state, { UIState } from "./ui_state";
import user from "./user";

export interface ImperialState {
  user: SelfUser | null;
  modal: ModalState | null;
  notifications: NotificationState;
  editor: EditorState;
  ui_state: UIState;
}

export const reducers = combineReducers<ImperialState>({
  user,
  modal,
  notifications,
  editor,
  ui_state,
});

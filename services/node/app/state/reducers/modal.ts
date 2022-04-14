import { AnyAction } from "redux";

export interface ModalState {
  modal: string;
  data?: unknown;
}

const modal = (state: ModalState | null = null, action: AnyAction) => {
  switch (action.type) {
    case "SET_MODAL":
      return action.payload;
    case "CLOSE_MODAL":
      return null;
    default:
      return state;
  }
};

export default modal;

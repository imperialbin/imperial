import { AnyAction } from "redux";
import { Modals } from "../../src/components/ModalManager";

export interface ModalState {
  modal: Modals;
  data?: unknown;
}

type ModalActions = {
  type: "OPEN_MODAL";
  payload: ModalState;
};

const modal = (state: ModalState | null = null, action: AnyAction) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return action.payload;
    case "CLOSE_MODAL":
      return null;
    default:
      return state;
  }
};

export default modal;

import { Modals } from "@web/components/ModalManager";

export interface ModalState {
  modal: Modals;
  data?: any;
}

type ModalActions =
  | {
      type: "OPEN_MODAL";
      payload: ModalState;
    }
  | { type: "CLOSE_MODAL" };

const modal = (state: ModalState | null = null, action: ModalActions) => {
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

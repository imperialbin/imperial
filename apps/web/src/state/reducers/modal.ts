import { Modals } from "@web/components/ModalManager";

export interface ModalState {
  modal: Modals;
  data?: any;
  previous?: {
    modal: Modals;
    data?: any;
  };
}

type ModalActions =
  | {
      type: "OPEN_MODAL";
      payload: ModalState;
    }
  | {
      type: "OPEN_SECOND_MODAL";
      payload: Omit<ModalState, "previous">;
    }
  | { type: "CLOSE_MODAL" };

const modal = (state: ModalState | null = null, action: ModalActions) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return action.payload;
    case "OPEN_SECOND_MODAL":
      return {
        ...action.payload,
        previous: state
          ? {
              modal: state.modal,
              data: state.data,
            }
          : undefined,
      };
    case "CLOSE_MODAL":
      if (state?.previous) {
        return state.previous;
      }

      return null;
    default:
      return state;
  }
};

export default modal;

import { Modals } from "../../src/components/ModalManager";
import { SelfUser } from "../../src/types";

export const setUser = (user: SelfUser) => {
  return {
    type: "SET_USER",
    payload: user,
  };
};

export const openModal = (modal: Modals, data?: unknown) => {
  return {
    type: "OPEN_MODAL",
    payload: { modal, data },
  };
};

export const closeModal = () => {
  return {
    type: "CLOSE_MODAL",
  };
};

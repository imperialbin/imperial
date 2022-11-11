import { Dispatch } from "redux";

export interface ModalProps {
  dispatch: Dispatch;
  closeModal: () => void;
}

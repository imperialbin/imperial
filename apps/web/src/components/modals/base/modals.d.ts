import { Dispatch } from "redux";

export interface ModalProps<T = any> {
  dispatch: Dispatch;
  closeModal: () => void;
  data?: T;
}

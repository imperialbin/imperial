import { ModalData, Modals } from "../../src/components/ModalManager";
import { SelfUser } from "../../src/types";
import { SupportedLanguages } from "../../src/utils/Consts";
import { Notification } from "../reducers/notifications";

export const setUser = (user: SelfUser) => {
  return {
    type: "SET_USER",
    payload: user,
  };
};

export const openModal = <T extends Modals>(modal: T, data?: ModalData<T>) => {
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

export const addNotification = (notification: Omit<Notification, "id">) => {
  return {
    type: "ADD_NOTIFICATION",
    payload: notification,
  };
};

export const removeNotification = (id: string) => {
  return {
    type: "REMOVE_NOTIFICATION",
    payload: { id },
  };
};

export const removeAllNotifications = () => {
  return {
    type: "REMOVE_ALL_NOTIFICATION",
  };
};

export const setReadOnly = (read_only: boolean) => {
  return {
    type: "SET_READONLY",
    payload: read_only,
  };
};
export const setLanguage = (language: SupportedLanguages) => {
  return {
    type: "SET_LANGUAGE",
    payload: language,
  };
};

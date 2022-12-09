import { ModalData, Modals } from "../../components/ModalManager";
import { SelfUser } from "../../types";
import { SupportedLanguagesID } from "../../utils/Constants";
import { Notification } from "../reducers/notifications";

export const setUser = (user: SelfUser) => {
  return {
    type: "SET_USER",
    payload: user,
  };
};

export const setDisableClickOutsideModal = (disable: boolean) => {
  return {
    type: "SET_DISABLE_CLICK_OUTSIDE_MODAL",
    payload: disable,
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
export const setLanguage = (language: SupportedLanguagesID) => {
  return {
    type: "SET_LANGUAGE",
    payload: language,
  };
};

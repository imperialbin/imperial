import { ModalData, Modals } from "../../components/ModalManager";
import { Id, SelfUser, User } from "../../types";
import { SupportedLanguagesID } from "../../utils/constants";
import { Notification } from "../reducers/notifications";

export const logoutUser = () => ({ type: "LOGOUT_USER" });

export const setUser = (user: SelfUser | null) => ({
  type: "SET_USER",
  payload: user,
});

export const addEditor = (user: User) => ({
  type: "ADD_EDITOR",
  payload: user,
});

export const removeEditor = (id: Id<"user">) => ({
  type: "REMOVE_EDITOR",
  payload: id,
});

export const setDisableClickOutsideModal = (disable: boolean) => ({
  type: "SET_DISABLE_CLICK_OUTSIDE_MODAL",
  payload: disable,
});

export const openModal = <T extends Modals>(
  modal: T,
  data?: ModalData<T>,
  second?: boolean,
) => ({
  type: second ? "OPEN_SECOND_MODAL" : "OPEN_MODAL",
  payload: { modal, data },
});

export const closeModal = () => ({
  type: "CLOSE_MODAL",
});

export const addNotification = (notification: Omit<Notification, "id">) => ({
  type: "ADD_NOTIFICATION",
  payload: notification,
});

export const removeNotification = (id: string) => ({
  type: "REMOVE_NOTIFICATION",
  payload: { id },
});

export const removeAllNotifications = () => ({
  type: "REMOVE_ALL_NOTIFICATION",
});

export const setReadOnly = (read_only: boolean) => ({
  type: "SET_READONLY",
  payload: read_only,
});

export const setLanguage = (language: SupportedLanguagesID) => ({
  type: "SET_LANGUAGE",
  payload: language,
});

export const setForkedContent = (forked_content: string | undefined) => ({
  type: "SET_FORKED_CONTENT",
  payload: forked_content,
});

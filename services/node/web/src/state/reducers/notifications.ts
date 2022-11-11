import { AnyAction } from "redux";
import { GenerateString } from "../../src/utils/GenerateString";

export type NotificationType = "success" | "info" | "error";
export type Notification = {
  type: NotificationType;
  message: string;
  onClick?: () => unknown;
  icon: JSX.Element;
  id: string;
};

export type NotificationState = Array<Notification> | [];

const initialPopNotificationsState: NotificationState = [];

const pop_notifications = (
  state: NotificationState = initialPopNotificationsState,
  action: AnyAction,
): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [{ ...action.payload, id: GenerateString() }, ...state];

    case "REMOVE_NOTIFICATION":
      return [
        ...state.filter(
          (notification) => notification.id !== action.payload.id,
        ),
      ];

    case "REMOVE_ALL_NOTIFICATIONS":
      return [];

    default:
      return state;
  }
};

export default pop_notifications;

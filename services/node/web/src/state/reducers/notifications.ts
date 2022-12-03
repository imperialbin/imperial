import { generateString } from "../../utils/Strings";

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

type PopNotificationActions =
  | {
      type: "ADD_NOTIFICATION";
      payload: Notification;
    }
  | {
      type: "REMOVE_NOTIFICATION";
      payload: { id: string };
    }
  | { type: "REMOVE_ALL_NOTIFICATIONS" };

const pop_notifications = (
  state: NotificationState = initialPopNotificationsState,
  action: PopNotificationActions
): NotificationState => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return [{ ...action.payload, id: generateString() }, ...state];

    case "REMOVE_NOTIFICATION":
      return [
        ...state.filter(
          (notification) => notification.id !== action.payload.id
        ),
      ];

    case "REMOVE_ALL_NOTIFICATIONS":
      return [];

    default:
      return state;
  }
};

export default pop_notifications;

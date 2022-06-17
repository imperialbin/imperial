import { memo, useCallback, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { ImperialState } from "../../state/reducers";
import styled from "styled-components";
import {
  Notification,
  NotificationType,
} from "../../state/reducers/notifications";
import { Dispatch } from "redux";
import { removeNotification } from "../../state/actions";
import { AnimatePresence, motion, Variants } from "framer-motion";

const Wrapper = styled.div`
  position: fixed;
  bottom: 10px;
  right: 20px;
  z-index: 999999;
`;

const NotificationWrapper = styled(motion.div)<{ type: NotificationType }>`
  display: flex;
  border-radius: 10px;
  padding: 10px 15px;
  max-width: 280px;
  margin: 10px 0;
  cursor: pointer;
  background: ${({ theme }) => theme.background.lightestOfTheBunch};

  svg {
    align-self: center;
    width: 40px;
    margin-right: 15px;
    color ${({ theme, type }) => theme.system[type]}
  }

  span {
    font-size: 1em;
  }
`;

interface INotificationProps {
  dispatch: Dispatch;
  notification: Notification;
}

const NotificationWrapperAnimation: Variants = {
  initial: {
    opacity: 0.5,
    y: 10,
    scale: 0.95,
  },
  animate: {
    scale: 1,
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
};

const Notification = memo(({ notification, dispatch }: INotificationProps) => {
  const close = useCallback(() => {
    dispatch(removeNotification(notification.id));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      close();
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <NotificationWrapper
      type={notification.type}
      onClick={close}
      animate="animate"
      initial="initial"
      exit="exit"
      variants={NotificationWrapperAnimation}
      transition={{ duration: 0.3, type: "spring" }}
      whileHover={{ scale: 1.05 }}
      layout
    >
      {notification.icon}
      <span>{notification.message}</span>
    </NotificationWrapper>
  );
});

Notification.displayName = "individual_notification";

const Notifications = ({ notifications, dispatch }: ReduxProps) => {
  useEffect(() => {
    if (notifications && notifications.length > 5) {
      dispatch(removeNotification(notifications[notifications.length - 1].id));
    }
  }, [notifications]);

  return (
    <Wrapper>
      <AnimatePresence>
        {notifications.length > 0
          ? notifications.map((notification) => (
              <Notification
                notification={notification}
                dispatch={dispatch}
                key={notification.id}
              />
            ))
          : null}
      </AnimatePresence>
    </Wrapper>
  );
};

const mapStateToProps = ({ notifications }: ImperialState) => {
  return { notifications };
};

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(Notifications);

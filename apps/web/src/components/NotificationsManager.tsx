import { memo, useCallback, useEffect } from "react";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { styled } from "@web/stitches.config";
import { removeNotification } from "@web/state/actions";
import { ImperialState } from "@web/state/reducers";
import { Notification as NotificationType } from "@web/state/reducers/notifications";

const Wrapper = styled("div", {
  position: "fixed",
  bottom: 10,
  right: 20,
  zIndex: "999999",
});

const NotificationWrapper = styled(motion.div, {
  display: "flex",
  alignItems: "center",
  borderRadius: "10px",
  padding: "10px 15px",
  maxWidth: 280,
  minHeight: 50,
  margin: "10px 0",
  cursor: "pointer",
  background: "$tertiary",
  color: "$text-secondary",
  fontSize: "0.9em",

  "> svg": {
    height: "auto",
    width: 25,
    marginRight: 10,
  },

  "> span": {
    fontSize: "1em",
  },

  variants: {
    type: {
      success: {
        "> svg": {
          color: "$success",
        },
      },
      warning: {
        "> svg": {
          color: "$warning",
        },
      },
      error: {
        "> svg": {
          color: "$error",
        },
      },
    },
  },
});

interface INotificationProps {
  dispatch: Dispatch;
  notification: NotificationType;
}

const NOTIFICATION_WRAPPER_ANIMATION: Variants = {
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
      layout
      type={notification.type}
      animate="animate"
      initial="initial"
      exit="exit"
      variants={NOTIFICATION_WRAPPER_ANIMATION}
      transition={{ duration: 0.3, type: "spring" }}
      whileHover={{ scale: 1.05 }}
      onClick={() => {
        close();
        notification.onClick?.();
      }}
    >
      {notification.icon}
      <span>{notification.message}</span>
    </NotificationWrapper>
  );
});

Notification.displayName = "individual_notification";

function NotificationManager({ notifications, dispatch }: ReduxProps) {
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
                key={notification.id}
                notification={notification}
                dispatch={dispatch}
              />
            ))
          : null}
      </AnimatePresence>
    </Wrapper>
  );
}

const mapStateToProps = ({ notifications }: ImperialState) => ({ notifications });

const connector = connect(mapStateToProps);
type ReduxProps = ConnectedProps<typeof connector>;

export default connector(NotificationManager);
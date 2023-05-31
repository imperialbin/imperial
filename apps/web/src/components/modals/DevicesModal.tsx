import { Device } from "@imperial/commons";
import dayjs from "dayjs";
import { SetStateAction, useEffect, useState } from "react";
import { Check, Trash, X } from "react-feather";
import Skeleton from "react-loading-skeleton";
import { Dispatch } from "redux";
import { addNotification } from "../../state/actions";
import { styled } from "../../stitches.config";
import { makeRequest } from "../../utils/rest";
import { parseUserAgent } from "../../utils/ua";
import Button from "../Button";
import Tooltip from "../Tooltip";
import PasswordPopover from "../popover/PasswordPopover";
import Popover from "../popover/Popover";
import Header from "./base/Header";
import { Content, Footer, Wrapper } from "./base/Styles";
import { ModalProps } from "./base/modals";

const DevicesWrapper = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gridAutoRows: "1fr",
  gap: "10px",
  width: "100%",
  minWidth: 550,
  maxWidth: 650,
  color: "$text-primary",
});

const DeviceContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  border: "1px solid $primary500",
  borderRadius: "$medium",
  padding: "$medium",
  gap: 5,

  "> div": {
    display: "flex",
    flexDirection: "column",

    "> h1": {
      display: "flex",
      alignItems: "center",
      fontSize: "1em",
      fontWeight: 600,
    },

    "> span": {
      fontSize: "0.9em",
      color: "$text-secondary",
    },
  },
});

const ActionButtons = styled("ul", {
  display: "flex",
  gap: 10,
  alignItems: "center",

  "> button": {
    padding: 0,
    outline: "unset",
    border: "unset",
    background: "unset",
    color: "$text-secondary",
    transition: "color 0.15s ease-in-out",
    cursor: "pointer",
    marginLeft: "auto",

    "&:hover": {
      color: "$error",
    },

    "> svg": {
      width: 18,
      cursor: "pointer",
      color: "$error",
      opacity: 0.75,
      transition: "opacity 0.15s ease-in-out",

      "&:hover": {
        opacity: 1,
      },
    },
  },
});

const ThisDeviceCircle = styled("div", {
  display: "inline-block",
  width: 10,
  height: 10,
  borderRadius: "50%",
  background: "$success",
});

function IndividualDevice({
  device,
  setDevices,
  dispatch,
}: {
  device: Device;
  setDevices: React.Dispatch<SetStateAction<Device[]>>;
  dispatch: Dispatch;
}) {
  const [passwordPopover, setPasswordPopover] = useState(false);
  const parsedUA = parseUserAgent(device.user_agent);

  const deleteDevice = async (password: string) => {
    const { success, error } = await makeRequest("POST", "/users/@me/devices", {
      device_id: device.id,
      password,
    });

    if (!success) {
      dispatch(
        addNotification({
          icon: <X />,
          message: error?.message ?? "An error occurred while deleting this device.",
          type: "error",
        }),
      );

      return;
    }

    dispatch(
      addNotification({
        icon: <Check />,
        message: "Successfully deleted device.",
        type: "success",
      }),
    );

    setPasswordPopover(false);
    setDevices((prev) => prev.filter((d) => d.id !== device.id));

    if (device.this_device) {
      window.location.reload();
    }
  };

  return (
    <DeviceContainer>
      <div>
        <h1>
          {device.ip} {parsedUA.osName} on {parsedUA.browserName}{" "}
        </h1>
        <span>Logged in {dayjs(device.created_at).format("MM/DD/YYYY")}</span>
      </div>
      <ActionButtons>
        {device.this_device ? (
          <Tooltip title="This device">
            <ThisDeviceCircle />
          </Tooltip>
        ) : null}
        <Popover
          active={passwordPopover}
          setPopover={setPasswordPopover}
          placement="bottom-start"
          extraOffset={10}
          render={(defaultProps) => (
            <PasswordPopover onSubmit={deleteDevice} {...defaultProps} />
          )}
        >
          <button type="button" onClick={() => setPasswordPopover(!passwordPopover)}>
            <Trash />
          </button>
        </Popover>
      </ActionButtons>
    </DeviceContainer>
  );
}

function DevicesModal({ dispatch, closeModal }: ModalProps) {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      const { success, data, error } = await makeRequest<Device[]>(
        "GET",
        "/users/@me/devices",
      );
      setLoading(false);

      if (!success || !data) {
        dispatch(
          addNotification({
            icon: <X />,
            message: error?.message ?? "An error occurred while fetching devices.",
            type: "error",
          }),
        );

        return;
      }

      setDevices(data);
    };

    fetchDevices();
  }, []);

  return (
    <Wrapper>
      <Header>Devices</Header>
      <Content>
        <DevicesWrapper>
          {!loading
            ? devices.map((device) => (
                <IndividualDevice
                  key={device.id}
                  device={device}
                  setDevices={setDevices}
                  dispatch={dispatch}
                />
              ))
            : Array.from({ length: 2 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <DeviceContainer key={i}>
                  <div>
                    <h1>
                      <Skeleton width={200} />
                    </h1>
                    <span>
                      <Skeleton width={110} />
                    </span>
                  </div>
                  <ActionButtons>
                    <button type="button">
                      <Skeleton width={50} />
                    </button>
                  </ActionButtons>
                </DeviceContainer>
              ))}
        </DevicesWrapper>
      </Content>
      <Footer>
        <Button onClick={closeModal}>Close</Button>
      </Footer>
    </Wrapper>
  );
}

export default DevicesModal;

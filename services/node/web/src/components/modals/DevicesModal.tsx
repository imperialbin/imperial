import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Monitor, X } from "react-feather";
import { useDevices } from "../../hooks/useDevices";
import { addNotification } from "../../state/actions";
import { styled } from "../../stitches";
import { makeRequest } from "../../utils/Rest";
import { parseUserAgent, UserAgent } from "../../utils/UA";
import Button from "../Button";
import Header from "./base/Header";
import { ModalProps } from "./base/modals";
import { Content, Footer, Paragraph, Wrapper } from "./base/Styles";

const StyledContent = styled(Content, {
  maxWidth: 600,
});

const Device = styled("div", {
  display: "flex",
  alignItems: "center",
  gap: 10,
  marginBottom: 20,
  border: "1px solid $contrast",
  background: "$tertiary",
  color: "$text-secondary",
  padding: "10px 10px",
  borderRadius: "$small",

  "> div": {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    color: "$text-primary",

    "> span": {
      fontSize: 14,
      color: "$text-secondary",
    },
  },
});

const StyledX = styled(X, {
  display: "block",
  width: 35,
  cursor: "pointer",
  marginLeft: 15,
  color: "$text-secondary",
  transition: "color 0.15s ease-in-out",

  "&:hover": {
    color: "$error",
  },
});

dayjs.extend(relativeTime);

const DevicesModal = ({ closeModal, dispatch }: ModalProps) => {
  const devices = useDevices();

  const userAgentString = (ua: UserAgent) => {
    return `${ua.browserName} ${ua.browserVersion} on ${ua.osName} ${ua.osVersion}`;
  };

  const deleteDevice = async (id: number) => {
    const { success, error } = await makeRequest("DELETE", `/devices/${id}`);

    if (!success) {
      dispatch(
        addNotification({
          type: "error",
          message:
            error?.message ?? "An error occurred whilst deleting this device",
          icon: <X />,
        })
      );
    }
  };

  return (
    <Wrapper>
      <Header>Devices</Header>
      <Paragraph>These are all your currently logged in devices</Paragraph>
      <StyledContent>
        {devices
          ? devices.map((device) => (
              <Device key={device.id}>
                <Monitor />
                <div>
                  <p>{userAgentString(parseUserAgent(device.user_agent))}</p>
                  <span>
                    {device.ip} — {dayjs(device.created_at).fromNow()}
                  </span>
                </div>
                <StyledX onClick={() => deleteDevice(device.id)} />
              </Device>
            ))
          : null}
      </StyledContent>
      <Footer>
        <Button onClick={closeModal}>Close</Button>
      </Footer>
    </Wrapper>
  );
};

export default DevicesModal;

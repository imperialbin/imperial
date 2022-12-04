import Switch, { ISwitchProps } from "./Switch";
import Dropdown, { IDropdownProps } from "./Dropdown";
import { styled } from "../stitches";

const SettingContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  margin: "15px 0",
  borderTop: "1px solid",
  borderTopColor: "$contrast",
});

const InfoContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  margin: "10px 0 0",
});

const Title = styled("h1", {
  fontSize: "1.15em",
  fontWeight: 500,
  margin: 0,
});

const Description = styled("p", {
  fontSize: "1em",
  maxWidth: "50ch",
  paddingRight: "15px",
  color: "$text-muted",
  margin: 0,
});

export interface ISettingProps extends ISwitchProps, IDropdownProps {
  title: string;
  description: string;
  type?: "switch" | "dropdown";
}

const Setting = ({
  /* For the actual setting its self */
  title,
  description,

  /* Type default switch */
  type = "switch",

  /* For switches */
  toggled,

  disabled = false,

  /* Drop down settings */
  initialValue = "",
  numberLimit = 60,
  mode,

  /* onToggle method for all to do something */
  onToggle,
}: ISettingProps): JSX.Element => (
  <SettingContainer>
    <InfoContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </InfoContainer>

    {/* Switches */}
    {type === "switch" ? (
      <Switch toggled={toggled} onToggle={onToggle} disabled={disabled} />
    ) : null}

    {/* Dropdowns */}
    {type === "dropdown" ? (
      <Dropdown
        mode={mode}
        onToggle={onToggle}
        initialValue={initialValue}
        disabled={disabled}
        numberLimit={numberLimit}
      />
    ) : null}
  </SettingContainer>
);

export default Setting;

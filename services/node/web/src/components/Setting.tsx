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
  fontWeight: 600,
  color: "$text-primary",
  margin: 0,
});

const Description = styled("p", {
  fontSize: "1em",
  maxWidth: "50ch",
  paddingRight: "15px",
  color: "$text-secondary",
  margin: 0,
});

type SettingProps<T = "dropdown" | "switch", k = unknown> = T extends "switch"
  ? {
      title: string;
      description: string;
      type: T;
      disabled?: boolean;
      toggled: boolean;
      onToggle: (toggled: boolean) => void;

      onSelect?: never;
      items?: never;
    }
  : {
      title: string;
      description: string;
      type: T;
      disabled?: boolean;
      onSelect: (item: IDropdownProps<k>["items"][number]) => void;
      items: IDropdownProps<k>["items"];

      toggled?: never;
      onToggle?: never;
    };

const Setting = <T = "switch" | "dropdown", K = unknown>({
  /* For the actual setting its self */
  title,
  description,

  /* Type default switch */
  type,

  /* For switches */
  toggled,

  disabled = false,

  /* onToggle method for all to do something */
  onToggle,
  onSelect,

  items,
}: SettingProps<T, K>): JSX.Element => (
  <SettingContainer>
    <InfoContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </InfoContainer>

    {/* Switches */}
    {type === "switch" ? (
      <Switch
        toggled={toggled}
        onToggle={() => {
          if (!onToggle || !toggled) return;

          onToggle(toggled);
        }}
        disabled={disabled}
      />
    ) : null}

    {/* Dropdowns */}
    {type === "dropdown" ? (
      <Dropdown
        items={items ?? []}
        onSelect={(item) => onSelect && onSelect(item)}
      />
    ) : null}
  </SettingContainer>
);

export default Setting;

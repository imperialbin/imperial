/* eslint-disable no-unused-vars */
import { styled } from "@web/stitches.config";
import Dropdown, { IDropdownProps } from "./Dropdown";
import Switch from "./Switch";

const SettingContainer = styled("div", {
  display: "flex",
  alignItems: "center",
  margin: "15px 0",
  borderTop: "1px solid",
  borderTopColor: "$primary500",
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
      disabledText?: string;
      toggled: boolean;
      onToggle: (toggled: boolean) => void;

      onSelect?: never;
      items?: never;

      minWidth?: never;
    }
  : {
      title: string;
      description: string;
      type: T;
      disabled?: boolean;
      disabledText?: string;
      onSelect: (item: IDropdownProps<k>["items"][number]) => void;
      items: IDropdownProps<k>["items"];

      toggled?: never;
      onToggle?: never;

      minWidth?: number;
    };

function Setting<T = "switch" | "dropdown", K = unknown>({
  // For the actual setting its self
  title,
  description,

  // Type default switch
  type,

  // For switches
  toggled,

  disabled = false,
  disabledText,

  // OnToggle method for all to do something
  onToggle,
  onSelect,

  items,

  minWidth,
}: SettingProps<T, K>): JSX.Element {
  return (
    <SettingContainer>
      <InfoContainer>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </InfoContainer>

      {/* Switches */}
      {type === "switch" ? (
        <Switch
          // Reset toggle
          key={toggled ? "toggled" : "not-toggled"}
          toggled={toggled}
          disabled={disabled}
          disabledText={disabledText}
          onToggle={() => {
            if (!onToggle || toggled === undefined) return;

            onToggle(toggled);
          }}
        />
      ) : null}

      {/* Dropdowns */}
      {type === "dropdown" ? (
        <Dropdown
          style={{ minWidth: minWidth ?? 82 }}
          items={items ?? []}
          onSelect={(item) => onSelect?.(item)}
        />
      ) : null}
    </SettingContainer>
  );
}

export default Setting;

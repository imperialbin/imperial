/* eslint-disable no-unused-vars */
import { ChangeEvent, useState } from "react";
import { styled } from "@web/stitches.config";
import Tooltip from "./Tooltip";
import { Lock } from "react-feather";

const SwitchElement = styled("label", {
  position: "relative",
  display: "inline-block",
});

const Slider = styled("span", {
  position: "relative",
  cursor: "pointer",
  textIndent: "-9999px",
  width: 55,
  height: 25,
  display: "block",
  borderRadius: 100,
  background: "$primary900",

  "&:after": {
    content: "",
    position: "absolute",
    top: 5,
    left: 5,
    width: 15,
    height: 15,
    borderRadius: "90px",
    transition: "0.3s",
    background: "$error",
  },
});

const CheckBox = styled("input", {
  height: 0,
  width: 0,
  visibility: "hidden",

  [`&:checked + ${Slider}:after`]: {
    width: 8,
    background: "$success",
    transform: "translateX(35px)",
  },

  [`&:disabled + ${Slider}`]: {
    opacity: 0.5,
    cursor: "not-allowed",
  },
});

const DisabledBackground = styled("div", {
  display: "flex",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  width: 55,
  height: 25,
  top: 20,
  backdropFilter: "blur(1.5px)",
  zIndex: 99,

  "> svg": {
    height: 15,
  },
});

export interface ISwitchProps {
  toggled?: boolean;
  onToggle: (e?: ChangeEvent<HTMLSelectElement>) => unknown;
  disabled?: boolean;
  disabledText?: string;
}

function Switch({
  toggled,
  onToggle,
  disabled,
  disabledText,
}: ISwitchProps): JSX.Element {
  const [checked, setChecked] = useState(toggled);

  return (
    <SwitchElement>
      {disabled ? (
        <Tooltip enabled={Boolean(disabledText)} title={disabledText ?? ""}>
          <DisabledBackground>
            <Lock />
          </DisabledBackground>
        </Tooltip>
      ) : null}
      <CheckBox
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={() => {
          setChecked(!checked);
          onToggle();
        }}
      />
      <Slider />
    </SwitchElement>
  );
}

export default Switch;

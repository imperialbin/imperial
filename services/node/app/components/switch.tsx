import { SwitchProps, ThemeForStupidProps } from "../types";
import styled from "styled-components";
import { useState } from "react";

const SwitchElement = styled.label`
  position: relative;
  display: inline-block;
`;

const Slider = styled.span`
  cursor: pointer;
  text-indent: -9999px;
  width: 200px;
  height: 100px;
  display: block;
  border-radius: 100px;
  position: relative;
  background: ${({ theme }: ThemeForStupidProps) => theme.layoutDark};

  &:after {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    width: 90px;
    height: 90px;
    background: #fff;
    border-radius: 90px;
    transition: 0.3s;
    background: ${({ theme }: ThemeForStupidProps) => theme.error};
  }
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })`
  height: 0;
  width: 0;
  visibility: hidden;

  &:checked + ${Slider}:after {
    position: absolute;
    background: ${({ theme }: ThemeForStupidProps) => theme.success};
    transform: translateX(110%);
  }
`;

export const Switch = ({ toggled, onToggle }: SwitchProps): JSX.Element => {
  const [checked, setChecked] = useState(toggled);
  return (
    <SwitchElement>
      <CheckBox
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          onToggle();
        }}
      />
      <Slider />
    </SwitchElement>
  );
};

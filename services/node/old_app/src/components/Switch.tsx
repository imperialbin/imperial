import styled from "styled-components";
import { ChangeEvent, useState } from "react";

const SwitchElement = styled.label`
  position: relative;
  display: inline-block;
`;

const Slider = styled.span`
  position: relative;
  cursor: pointer;
  text-indent: -9999px;
  width: 55px;
  height: 25px;
  display: block;
  border-radius: 100px;
  position: relative;
  background: ${({ theme }) => theme.background.dark};

  &:after {
    content: "";
    position: absolute;
    top: 5px;
    left: 5px;
    width: 15px;
    height: 15px;
    background: #fff;
    border-radius: 90px;
    transition: 0.3s;
    background: ${({ theme }) => theme.system.error};
  }
`;

const CheckBox = styled.input.attrs({ type: "checkbox" })`
  height: 0;
  width: 0;
  visibility: hidden;

  &:checked + ${Slider}:after {
    width: 8px;
    background: ${({ theme }) => theme.system.success};
    transform: translateX(35px);
  }

  &:disabled + ${Slider} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export interface ISwitchProps {
  toggled?: boolean;
  onToggle: (e?: ChangeEvent<HTMLSelectElement>) => unknown;
  disabled?: boolean;
}

const Switch = ({ toggled, onToggle, disabled }: ISwitchProps): JSX.Element => {
  const [checked, setChecked] = useState(toggled);
  return (
    <SwitchElement>
      <CheckBox
        checked={checked}
        onChange={() => {
          setChecked(!checked);
          onToggle();
        }}
        disabled={disabled}
      />
      <Slider />
    </SwitchElement>
  );
};

export default Switch;

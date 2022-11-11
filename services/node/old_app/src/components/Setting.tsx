import styled from "styled-components";
import Switch, { ISwitchProps } from "./Switch";
import Dropdown, { IDropdownProps } from "./Dropdown";

const SettingContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  border-top: 1px solid ${({ theme }) => theme.text.dark}1d;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 10px 0 0;
`;

const Title = styled.h1`
  font-size: 1.15em;
  font-weight: 500;
  margin: 0;
`;

const Description = styled.p`
  font-size: 1em;
  max-width: 50ch;
  padding-right: 15px;
  color: ${({ theme }) => theme.text.dark};
  margin: 0;
`;

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

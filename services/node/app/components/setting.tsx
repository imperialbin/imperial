import { Switch, Dropdown } from ".";
import styled from "styled-components";
import { SettingProps, ThemeForStupidProps } from "../types";

const SettingContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  border-top: 1px solid
    ${({ theme }: ThemeForStupidProps) => theme.textDarker}1d;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  margin: 10px 0 0;
`;

const Title = styled.h1`
  font-size: 1.3em;
  font-weight: 500;
  margin: 0;
`;

const Description = styled.p`
  font-size: 1em;
  max-width: 50ch;
  padding-right: 15px;
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
  margin: 0;
`;

export const Setting = ({
  /* For the actual setting its self */
  title,
  description,

  /* Type */
  type = "switch",

  /* For switches */
  toggled,
  toggleable = true,

  /* Drop down settings */
  initialValue = "",
  mode,

  /* onToggle method for all to do something */
  onToggle,
}: SettingProps): JSX.Element => {
  return (
    <SettingContainer>
      <InfoContainer>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </InfoContainer>

      {/* Switches */}
      {type === "switch" && (
        <Switch toggled={toggled} onToggle={onToggle} toggleable={toggleable} />
      )}

      {/* Dropdowns */}
      {type === "dropdown" && (
        <Dropdown mode={mode} onToggle={onToggle} initialValue={initialValue} />
      )}
    </SettingContainer>
  );
};

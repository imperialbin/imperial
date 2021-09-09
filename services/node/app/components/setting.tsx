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
  title,
  description,
  toggled,
  toggleable = true,
  checkbox = true,
  type = "languages",
  initialValue = "",
  onToggle,
}: SettingProps): JSX.Element => {
  return (
    <SettingContainer>
      <InfoContainer>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </InfoContainer>
      {checkbox ? (
        <Switch toggled={toggled} onToggle={onToggle} toggleable={toggleable} />
      ) : (
        <Dropdown type={type} onToggle={onToggle} initialValue={initialValue} />
      )}
    </SettingContainer>
  );
};

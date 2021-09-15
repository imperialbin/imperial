import styled from "styled-components";
import { InputProps, ThemeForStupidProps } from "../types";

const Container = styled.div`
  position: relative;
`;

const Label = styled.label`
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
`;

const InputElement = styled.input<{ secretValue: boolean }>`
  display: block;
  width: 80%;
  max-width: 230px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 5px 0 10px;
  border-radius: 8px;
  border: none;
  font-size: 1em;
  padding: 13px 40px 13px 12px;
  background: ${({ theme }: ThemeForStupidProps) => theme.layoutDark};
  box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.25);
  outline: none;
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight}5d;
  transition: color 0.1s ease-in-out;

  &:focus {
    color: ${({ theme }: ThemeForStupidProps) => theme.textLight}9d;
  }

  &:not(:hover) {
    color: ${({ secretValue }) => secretValue && "transparent"};
    text-shadow: ${({ secretValue, theme }) =>
      secretValue ? `0 0 5px ${theme.textLight}9d` : "unset"};
  }

  &::placeholder {
    color: ${({ theme }: ThemeForStupidProps) => theme.textDarker}7d;
  }
`;

const Icon = styled.div`
  position: absolute;
  bottom: 10px;
  margin-left: 249px;
  cursor: pointer;
  color: ${({ theme }: ThemeForStupidProps) => theme.textDarker};
`;

export const Input = ({
  placeholder,
  label,
  value = "",
  icon,
  iconClick,
  secretValue = false,
  iconDisabled = false,
  inputDisabled = false,
}: InputProps): JSX.Element => {
  return (
    <Container>
      <Label>{label}</Label>
      <InputElement
        value={value}
        placeholder={placeholder}
        disabled={inputDisabled}
        secretValue={secretValue}
      />
      {icon && <Icon onClick={iconClick}>{icon}</Icon>}
    </Container>
  );
};

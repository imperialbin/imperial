import styled from "styled-components";
import { DropdownProps, ThemeForStupidProps } from "../types";
import { supportedLanguages } from "../utils";

const Select = styled.select`
  background: ${({ theme }: ThemeForStupidProps) => theme.layoutLittleLessDark};
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  margin-top: 10px;
  font-size: 0.95em;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Option = styled.option``;

export const Dropdown = ({
  mode,
  onToggle,
  initialValue,
  disabled = false,
}: DropdownProps): JSX.Element => {
  return (
    <Select defaultValue={initialValue} onChange={onToggle} disabled={disabled}>
      {mode === "expiration" && (
        <>
          {[...Array(60)].map((day: number, key: number) => {
            return (
              <Option value={key + 1} key={key}>
                {key + 1}
              </Option>
            );
          })}
        </>
      )}
      {mode === "languages" && (
        <>
          {supportedLanguages.map((language, key) => {
            return (
              <Option value={language.name} key={key}>
                {language.name}
              </Option>
            );
          })}
        </>
      )}
    </Select>
  );
};

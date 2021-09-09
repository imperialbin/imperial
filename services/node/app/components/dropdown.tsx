import styled from "styled-components";
import { DropdownProps, ThemeForStupidProps } from "../types";
import { supportedLanguages } from "../utils";

const Select = styled.select`
  background: ${({ theme }: ThemeForStupidProps) => theme.layoutLittleLessDark};
  border: none;
  padding: 5px 10px;
  color: ${({ theme }: ThemeForStupidProps) => theme.textLight};
  margin-top: 10px;
`;

const Option = styled.option``;

export const Dropdown = ({
  type,
  onToggle,
  initialValue,
}: DropdownProps): JSX.Element => {
  console.log(initialValue);
  return (
    <Select defaultValue={initialValue} onChange={onToggle}>
      {type === "expiration" && (
        <>
          {[...Array(60)].map((day: number, key: number) => {
            return (
              <Option value={key} key={key}>
                {key}
              </Option>
            );
          })}
        </>
      )}
      {type === "languages" && (
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

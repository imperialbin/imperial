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

export const Dropdown = ({ type }: DropdownProps): JSX.Element => {
  return (
    <Select>
      {type === "expiration" && <Option value={"test"}>test</Option>}
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

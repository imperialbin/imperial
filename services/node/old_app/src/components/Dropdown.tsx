import { ChangeEvent } from "react";
import styled from "styled-components";
import { supportedLanguages } from "../utils/Consts";

const Select = styled.select`
  background: ${({ theme }) => theme.background.littleLessDark};
  border: none;
  border-radius: 4px;
  padding: 5px 10px;
  color: ${({ theme }) => theme.text.light};
  margin-top: 10px;
  font-size: 0.95em;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Option = styled.option``;

export interface IDropdownProps {
  mode?: "languages" | "expiration";
  onToggle: (e?: ChangeEvent<HTMLSelectElement>) => unknown;
  initialValue?: string | number;
  numberLimit?: number;
  disabled?: boolean;
}

const Dropdown = ({
  mode,
  onToggle,
  initialValue,
  disabled = false,
  numberLimit,
}: IDropdownProps): JSX.Element => (
  <Select defaultValue={initialValue} onChange={onToggle} disabled={disabled}>
    {mode === "expiration" ? (
      <>
        {[...Array(numberLimit || 60)].map((day: number, key: number) => (
          <Option value={key + 1} key={key}>
            {key + 1}
          </Option>
        ))}
      </>
    ) : null}
    {mode === "languages" ? (
      <>
        {supportedLanguages.map((language, key) => (
          <Option value={language.name} key={key}>
            {language.name}
          </Option>
        ))}
      </>
    ) : null}
  </Select>
);

export default Dropdown;

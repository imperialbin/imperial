import { ChangeEvent } from "react";
import { styled } from "../stitches";
import { supportedLanguages } from "../utils/Constants";

const Select = styled("select", {
  background: "$contrast",
  borderRadius: "4px",
  padding: "5px 10px",
  color: "$text-primary",
  marginTop: "10px",
  fontSize: "0.95em",
  border: "2px solid var(---bg-tertiary)",

  "&:disabled": {
    cursor: "not-allowed",
    opacity: 0.5,
  },
});

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
    {mode === "expiration"
      ? [...Array(numberLimit || 60)].map((day: number, key: number) => (
          <option value={key + 1} key={key}>
            {key + 1}
          </option>
        ))
      : null}
    {mode === "languages"
      ? supportedLanguages.map((language, key) => (
          <option value={language.name} key={key}>
            {language.name}
          </option>
        ))
      : null}
  </Select>
);

export default Dropdown;

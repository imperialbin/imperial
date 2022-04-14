import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { InputProps } from "../../types";

const Container = styled.div`
  position: relative;
  max-width: 288px;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.textDarker};
`;

const InputContainer = styled.div`
  display: flex;
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
  background: ${({ theme }) => theme.layoutDark};
  box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.25);
  outline: none;
  color: ${({ theme }) => theme.textLight}5d;
  transition: all 0.1s ease-in-out;

  &:focus,
  &:focus::placeholder {
    color: ${({ theme }) => theme.textLight}9d;
  }

  &:not(:hover) {
    color: ${({ secretValue }) => secretValue && "transparent"};
    text-shadow: ${({ secretValue, theme }) =>
      secretValue ? `0 0 5px ${theme.textLight}9d` : "unset"};
  }

  &::placeholder {
    color: ${({ theme }) => theme.textDarker}7d;
    transition: all 0.1s ease-in-out;
  }
`;

const Icon = styled(motion.div)<{ iconHoverColor: string | null }>`
  position: absolute;
  bottom: 18px;
  right: 16px;
  cursor: pointer;
  overflow: hidden;
  color: ${({ theme }) => theme.textDarker};
  transition: color 0.2s ease-in-out;

  &:hover {
    color: ${({ iconHoverColor }) => iconHoverColor};
  }
`;

const iconAnimation = {
  initial: {
    opacity: 0,
    x: 10,
    width: 0,
  },
  changed: {
    opacity: 1,
    x: 0,
    width: "unset",
  },
  exit: {
    opacity: 0,
    x: 10,
    width: 0,
  },
};

export const Input = ({
  placeholder,
  label,
  value = "",
  icon,
  iconClick,
  secretValue = false,
  iconHoverColor = null,
  hideIconUntilDifferent = false,
  inputDisabled = false,
  onChange,
  type = "",
  inputProps,
}: InputProps): JSX.Element => {
  const [inputValue, setInputValue] = useState(value);

  if (inputValue !== value) hideIconUntilDifferent = false;

  return (
    <Container>
      <Label>{label}</Label>
      <InputContainer>
        <InputElement
          value={inputValue}
          onChange={e => {
            setInputValue(e.target.value);
            if (onChange) {
              onChange(e);
            }
          }}
          placeholder={placeholder}
          disabled={inputDisabled}
          secretValue={secretValue}
          type={type}
          {...inputProps}
        />
        <AnimatePresence>
          {icon && !hideIconUntilDifferent && (
            <Icon
              initial={"initial"}
              animate={"changed"}
              exit={"exit"}
              variants={iconAnimation}
              onClick={iconClick}
              iconHoverColor={iconHoverColor}
            >
              {icon}
            </Icon>
          )}
        </AnimatePresence>
      </InputContainer>
    </Container>
  );
};

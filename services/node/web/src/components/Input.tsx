import { AnimatePresence, motion } from "framer-motion";
import { ChangeEventHandler, InputHTMLAttributes, useState } from "react";
import { styled } from "../stitches";

const Container = styled("div", {
  position: "relative",
});

const Label = styled("label", {
  color: "$text-muted",
});

const InputContainer = styled("div", {
  width: "100%",
  position: "relative",
  display: "flex",
});

const Wrapper = styled("div", {
  display: "flex",
  alignItems: "center",
  position: "relative",
  width: "85%",
});

const InputElement = styled("input", {
  display: "block",
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  margin: "5px 0 10px",
  borderRadius: 8,
  border: "none",
  fontSize: "0.9em",
  padding: "13px 40px 13px 12px",
  background: "$primary",
  boxShadow: "0px 0px 18px rgba(0, 0, 0, 0.25)",
  outline: "none",
  color: "$text-secondary",
  transition: "all 0.1s ease-in-out",

  "&:focus, &:focus::placeholder": {
    color: "$text-secondary",
  },

  "&:not(:hover)": {
    color: "transparent",
    textShadow:
      "${({ secretValue, theme }) => secretValue ? `0 0 5px ${theme.text.light}9d` : unset}",
  },

  "&::placeholder": {
    color: "$text-muted",
    transition: "all 0.1s ease-in-out",
  },

  variants: {
    hasSecretValue: {
      true: {
        textShadow:
          "${({ secretValue, theme }) => secretValue ? `0 0 5px ${theme.text.light}9d` : unset}",
      },
    },
  },
});

const Icon = styled(motion.div, {
  position: "absolute",
  right: 15,
  cursor: "pointer",
  overflow: "hidden",
  color: "$text-dark",
  transition: "color 0.2s ease-in-out",

  "> svg": {
    width: 23,
  },

  "&:hover": {
    color: "${({ iconHoverColor }) => iconHoverColor}",
  },
  variants: {
    iconHoverColor: {},
  },
});

const ICON_ANIMATION = {
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

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  label: string;
  value?: string;
  icon: JSX.Element;
  secretValue?: boolean;
  iconClick: () => unknown;
  iconDisabled?: boolean;
  iconHoverColor?: string | null;
  hideIconUntilDifferent?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  inputDisabled?: boolean;
  tooltipTitle?: string | undefined;
  type?: string;
}

const Input = ({
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
  ...props
}: IInputProps): JSX.Element => {
  const [inputValue, setInputValue] = useState(value);

  if (inputValue !== value) hideIconUntilDifferent = false;

  return (
    <Container>
      <Label>{label}</Label>
      <InputContainer>
        <Wrapper>
          <InputElement
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);

              if (onChange) onChange(e);
            }}
            placeholder={placeholder}
            disabled={inputDisabled}
            hasSecretValue={secretValue}
            type={type}
            {...props}
          />
          <AnimatePresence>
            {icon && !hideIconUntilDifferent ? (
              <Icon
                initial="initial"
                animate="changed"
                exit="exit"
                variants={ICON_ANIMATION}
                onClick={iconClick}
                /* @ts-ignore will fix later */
                iconHoverColor={iconHoverColor}
              >
                {icon}
              </Icon>
            ) : null}
          </AnimatePresence>
        </Wrapper>
      </InputContainer>
    </Container>
  );
};

export default Input;

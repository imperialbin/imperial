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
  position: "relative",
  display: "flex",
  width: "100%",
  alignItems: "stretch",
  flexWrap: "wrap",
  color: "$text-secondary",
});

const InputElement = styled("input", {
  outline: "none",
  border: "none",
  display: "block",
  padding: "0.9rem 40px",
  paddingRight: 10,
  fontWeight: 600,
  borderRadius: "$medium",
  background: "$primary",
  transition: "all 0.15s ease",
  color: "$text-secondary",

  "&:focus, &:focus::placeholder": {
    color: "$text-secondary",
  },

  "&:not(:hover)": {
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

const IconContainer = styled(motion.div, {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: 2,
  bottom: 2,
  padding: 10,
  pointerEvents: "none",

  "> svg": {
    width: 18,
    height: 18,
    color: "",
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
  label?: string;
  value?: string;
  icon?: JSX.Element;
  secretValue?: boolean;
  iconClick?: () => unknown;
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
      {label ? <Label>{label}</Label> : null}
      <Wrapper>
        <AnimatePresence>
          {icon && !hideIconUntilDifferent ? (
            <IconContainer
              initial="initial"
              animate="changed"
              exit="exit"
              variants={ICON_ANIMATION}
              onClick={iconClick}
              /* @ts-ignore will fix later */
              iconHoverColor={iconHoverColor}
            >
              {icon}
            </IconContainer>
          ) : null}
        </AnimatePresence>
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
      </Wrapper>
    </Container>
  );
};

export default Input;

import { AnimatePresence, motion } from "framer-motion";
import { ChangeEventHandler, InputHTMLAttributes, useState } from "react";
import { styled } from "../stitches";

const Container = styled("div", {
  position: "relative",
});

const Label = styled("label", {
  display: "block",
  color: "$text-muted",
  marginBottom: 5,
});

const Wrapper = styled("div", {
  position: "relative",
  display: "flex",
  width: "100%",
  alignItems: "stretch",
  flexWrap: "wrap",
  color: "$text-secondary",
  overflow: "hidden",
});

const InputElement = styled("input", {
  outline: "none",
  width: "100%",
  display: "block",
  paddingRight: 10,
  fontWeight: 500,
  borderRadius: "$medium",
  background: "$contrast",
  transition: "background 0.15s ease-in-out",
  color: "$text-secondary",
  border: "2px solid var(--bg-contrast)",

  "&:focus": {
    color: "$text-secondary",
    background: "$primary",
  },

  "&::placeholder": {
    color: "$text-muted",
  },

  variants: {
    hasIcon: {
      true: {
        padding: "0.9em 35px",
      },
      false: {
        padding: "0.9em 10px",
      },
    },
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
  },
});

const ICON_ANIMATION = {
  initial: {
    scale: 0.5,
    width: 0,
  },
  animate: {
    scale: 1,
    width: "auto",
  },
  exit: {
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
              initial={ICON_ANIMATION.initial}
              exit={ICON_ANIMATION.exit}
              animate={ICON_ANIMATION.animate}
              onClick={iconClick}
              transition={{ duration: 0.15 }}
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
          hasIcon={!!icon}
          {...props}
        />
      </Wrapper>
    </Container>
  );
};

export default Input;

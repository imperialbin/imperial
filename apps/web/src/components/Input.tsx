import { AnimatePresence, motion } from "framer-motion";
import React, { ChangeEventHandler, InputHTMLAttributes, useState } from "react";
import { styled } from "@web/stitches.config";

const Container = styled("label", {
  position: "relative",

  "> span": {
    display: "block",
    color: "$text-secondary",
    fontSize: "0.9em",
  },
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
    iconPosition: {
      right: {
        padding: "0.9em 35px 0.9em 10px",
      },
      left: {
        padding: "0.9em 35px",
      },
    },
    hasSecretValue: {
      true: {
        "&:not(:hover)": {
          color: "transparent",
          textShadow: "0 0 5px var(--text-secondary)",
        },
      },
    },
  },
});

const IconContainer = styled("div", {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: 2,
  bottom: 2,
  padding: 10,

  "> div > svg": {
    width: 18,
    height: 18,
    transition: "color 0.15s ease-in-out",
  },

  variants: {
    hasCallback: {
      true: {
        pointerEvents: "unset",
        cursor: "pointer",
      },
      false: {
        pointerEvents: "none",
      },
    },
    position: {
      right: {
        right: 0,
      },
      left: {
        left: 0,
      },
    },
  },
});

const ICON_ANIMATION_LEFT = {
  initial: {
    left: -50,
    width: 0,
    opacity: 0,
  },
  animate: {
    left: 0,
    width: "auto",
    opacity: 1,
  },
};

const ICON_ANIMATION_RIGHT = {
  initial: {
    right: -50,
    width: 0,
  },
  animate: {
    right: 0,
    width: "auto",
  },
};

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder: string;
  label?: string;
  value?: string;
  icon?: JSX.Element;
  iconPosition?: "left" | "right";
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

const Input = React.forwardRef<HTMLLabelElement, IInputProps>(
  (
    {
      placeholder,
      label,
      value = "",
      icon,
      iconClick,
      iconPosition = "left",
      secretValue = false,
      hideIconUntilDifferent = false,
      inputDisabled = false,
      onChange,
      type = "",
      ...props
    },
    ref,
  ) => {
    const [inputValue, setInputValue] = useState(value);

    if (inputValue !== value) hideIconUntilDifferent = false;

    return (
      <Container ref={ref}>
        {label ? <span>{label}</span> : null}
        <Wrapper>
          <AnimatePresence>
            {icon && !hideIconUntilDifferent ? (
              <IconContainer position={iconPosition} hasCallback={Boolean(iconClick)}>
                <motion.div
                  style={{ position: "relative" }}
                  initial={
                    iconPosition === "left"
                      ? ICON_ANIMATION_LEFT.initial
                      : ICON_ANIMATION_RIGHT.initial
                  }
                  exit={
                    iconPosition === "left"
                      ? ICON_ANIMATION_LEFT.initial
                      : ICON_ANIMATION_RIGHT.initial
                  }
                  animate={
                    iconPosition === "left"
                      ? ICON_ANIMATION_LEFT.animate
                      : ICON_ANIMATION_RIGHT.animate
                  }
                  transition={{ duration: 0.25 }}
                  onClick={iconClick}
                >
                  {icon}
                </motion.div>
              </IconContainer>
            ) : null}
          </AnimatePresence>
          <InputElement
            value={inputValue}
            placeholder={placeholder}
            disabled={inputDisabled}
            hasSecretValue={secretValue}
            type={type}
            hasIcon={Boolean(icon)}
            iconPosition={iconPosition}
            onChange={(e) => {
              setInputValue(e.target.value);

              if (onChange) onChange(e);
            }}
            {...props}
          />
        </Wrapper>
      </Container>
    );
  },
);

Input.displayName = "Input";

export default Input;

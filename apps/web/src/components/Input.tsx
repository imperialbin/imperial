import { styled } from "@web/stitches.config";
import { motion } from "framer-motion";
import React, { InputHTMLAttributes, useMemo } from "react";
import Tooltip from "./Tooltip";

const Wrapper = styled("div", {
  position: "relative",
  display: "flex",
  alignItems: "stretch",
  flexWrap: "wrap",
  width: "100%",
  color: "$text-secondary",
  overflow: "hidden",
});

const IconContainer = styled(motion.div, {
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  top: 2,
  bottom: 2,

  "> svg": {
    width: 20,
  },

  variants: {
    position: {
      left: {
        left: 10,
      },
      right: {
        right: 10,
      },
    },
  },
});

const InputComponent = styled("input", {
  outline: "none",
  width: "100%",
  display: "block",
  padding: "0.9em 10px",
  fontWeight: 500,
  borderRadius: "$medium",
  background: "$primary600",
  transition: "background 0.15s ease-in-out, text-shadow 0.15s ease-in-out",
  color: "$text-secondary",
  border: "2px solid $primary600",

  "&:focus": {
    color: "$text-secondary",
    background: "$primary900",
  },

  "&::placeholder": {
    color: "$text-muted",
  },

  variants: {
    hasSecretValue: {
      true: {
        "&:not(:hover)": {
          color: "transparent",
          textShadow: "0 0 5px var(--text-secondary)",
        },
      },
    },
    hasBtn: {
      true: {
        paddingRight: 35,
      },
    },
    iconPosition: {
      left: {
        paddingLeft: 35,
      },
      right: {
        paddingRight: 35,
      },
    },
  },
});

const StyledBtn = styled("button", {
  outline: "none",
  background: "unset",
  border: "unset",
  color: "$text-secondary",
  cursor: "pointer",

  "> svg": {
    height: 20,
  },
});

const ICON_ANIMATION_LEFT = {
  initial: {
    left: -50,
    width: 0,
    opacity: 0,
  },
  animate: {
    left: 10,
    width: "auto",
    opacity: 1,
  },
};

const ICON_ANIMATION_RIGHT = {
  initial: {
    right: -50,
    width: 0,
    opacity: 0,
  },
  animate: {
    right: 10,
    width: "auto",
    opacity: 1,
  },
};

export interface IInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: {
    svg: JSX.Element;
    position?: "left" | "right";
  };
  secretValue?: boolean;
  button?: {
    svg: JSX.Element;
    onClick: () => unknown;
    disabled?: boolean;
    hoverColor?: string;
    hideUntilChanged?: boolean;
    tooltip?: string;
  };
  tooltip?: string | undefined;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ icon, button, secretValue, ...rest }, ref) => {
    const initialValue = useMemo(() => rest.value, []);
    const showBtn = button?.hideUntilChanged ? initialValue !== rest.value : true;

    return (
      <label>
        {rest.label ? <span>{rest.label}</span> : null}
        <Wrapper>
          {icon ? (
            <IconContainer
              initial={ICON_ANIMATION_LEFT.initial}
              animate={ICON_ANIMATION_LEFT.animate}
              position={icon.position ?? "left"}
            >
              {icon.svg}
            </IconContainer>
          ) : null}
          <InputComponent
            ref={ref}
            iconPosition={icon?.position ?? icon ? "left" : undefined}
            hasSecretValue={secretValue}
            hasBtn={Boolean(button)}
            {...rest}
          />
          {button && showBtn ? (
            <IconContainer
              key={rest.label + "_btn"}
              initial={ICON_ANIMATION_RIGHT.initial}
              animate={ICON_ANIMATION_RIGHT.animate}
              exit={ICON_ANIMATION_RIGHT.initial}
              position="right"
            >
              <Tooltip title={button.tooltip ?? ""} enabled={Boolean(button.tooltip)}>
                <StyledBtn
                  type="button"
                  disabled={button.disabled}
                  onClick={button.onClick}
                >
                  {button.svg}
                </StyledBtn>
              </Tooltip>
            </IconContainer>
          ) : null}
        </Wrapper>
      </label>
    );
  },
);

Input.displayName = "Input";

export default Input;

/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import type * as Stitches from "@stitches/react";
import { styled } from "@web/stitches.config";

// Vercel deploy

const StyledButton = styled("button", {
  display: "flex",
  alignItems: "center",
  gap: 5,
  padding: "8px 10px",
  borderRadius: "$tiny",
  background: "$primary700",
  color: "$text-secondary",
  cursor: "pointer",
  border: "1px solid $primary500",
  transition: "color 0.15s ease-in-out, border 0.15s ease-in-out",

  "&:hover": {
    color: "$text-primary",
  },

  "&:disabled": {
    opacity: 0.8,
    color: "$text-muted",
    cursor: "not-allowed",
  },

  "> svg": {
    height: 18,
  },

  variants: {
    btnType: {
      primary: {},
      secondary: {
        background: "unset",
      },
    },
  },
});

type ButtonProps = {
  children: React.ReactNode;
  clickOnEnter?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & React.ComponentPropsWithRef<"button"> &
  Stitches.VariantProps<typeof StyledButton>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    useEffect(() => {
      const onKeyPress = (e: KeyboardEvent) => {
        if (e.key !== "Enter" || props.disabled || !props.onClick) return;

        props.onClick();
      };

      if (props.clickOnEnter && props.onClick)
        document.addEventListener("keydown", onKeyPress);

      return () => {
        document.removeEventListener("keydown", onKeyPress);
      };
    }, [props.onClick, props.clickOnEnter, props.disabled]);

    return (
      <StyledButton ref={ref} {...props}>
        {children}
      </StyledButton>
    );
  },
);

Button.displayName = "Button";

export default Button;

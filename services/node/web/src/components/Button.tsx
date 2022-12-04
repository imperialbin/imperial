import React from "react";
import type * as Stitches from "@stitches/react";
import { styled } from "../stitches";

const StyledButton = styled("button", {
  padding: "8px 10px",
  borderRadius: "$tiny",
  background: "$tertiary",
  color: "$text-secondary",
  cursor: "pointer",
  border: "1.5px solid var(--bg-contrast)",
  transition: "color 0.15s ease-in-out, border 0.15s ease-in-out",

  "&:hover": {
    color: "$text-primary",
  },

  "&:disabled": {
    opacity: 0.5,
  },

  variants: {
    btnType: {
      primary: {},
      secondary: {
        background: "$contrast",
      },
    },
  },
});

interface ButtonProps
  extends React.ComponentPropsWithRef<"button">,
    Stitches.VariantProps<typeof StyledButton> {
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <StyledButton ref={ref} {...props}>
        {children}
      </StyledButton>
    );
  }
);

export default Button;

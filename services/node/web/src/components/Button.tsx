import React from "react";
import type * as Stitches from "@stitches/react";
import { styled } from "../stitches";

const StyledButton = styled("button", {
  padding: "8px 10px",
  borderRadius: "$tiny",
  border: "none",
  background: "$tertiary",
  color: "$text-primary",
  cursor: "pointer",

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

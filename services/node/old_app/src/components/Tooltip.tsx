import { ReactChild } from "react";
import { Tooltip as Tippy, TooltipProps } from "react-tippy";

export const Tooltip = (
  props: TooltipProps & { children?: ReactChild },
): JSX.Element => (
  /* @ts-expect-error this package hasnt updated react18 types yet */
  <Tippy
    animation="shift"
    animateFill={false}
    duration={300}
    style={{ display: "block" }}
    position="bottom"
    {...props}
  >
    {props.children}
  </Tippy>
);

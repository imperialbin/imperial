import { ReactChild } from "react";
import { Tooltip as Tippy, TooltipProps } from "react-tippy";

export const Tooltip = (
  props: TooltipProps & { children?: ReactChild }
): JSX.Element => (
  <Tippy
    animation="shift"
    animateFill={false}
    position={props ? props.position : "bottom"}
    {...props}
  >
    {props.children}
  </Tippy>
);

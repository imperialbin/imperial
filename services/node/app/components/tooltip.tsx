import { ReactChild } from "react";
import { Tooltip as Tippy, TooltipProps } from "react-tippy";
import { ThemeForStupidProps } from "../types";

export const Tooltip = (
  props: TooltipProps & { children?: ReactChild }
): JSX.Element => (
  <Tippy
    animation="shift"
    animateFill={false}
    position={props.position ? props.position : "bottom"}
    {...props}
  >
    {props.children}
  </Tippy>
);

import { Placement } from "@floating-ui/react-dom-interactions";
import { CSSProperties } from "@stitches/react";
import { ReactElement, useState } from "react";
import { styled } from "@web/stitches.config";
import Popover from "./popover/Popover";

const TooltipStyle = styled("div", {
  maxWidth: 300,
  padding: "5px 10px",
  userSelect: "none",
  fontSize: "0.88rem !important",
  border: "1px solid hsl(var(--primary-primary))",
  borderRadius: "$medium",

  variants: {
    textAlign: {
      center: { textAlign: "center" },
      end: { textAlign: "end" },
      start: { textAlign: "start" },
      left: { textAlign: "left" },
      right: { textAlign: "right" },
    },
  },
});

type AlignText = "center" | "end" | "start" | "left" | "right";

interface ITooltipProps {
  placement?: Placement;
  alignText?: AlignText;
  children: JSX.Element;
  title: string | ReactElement;
  enabled?: boolean;
  style?: CSSProperties;
}

function Tooltip({
  placement,
  children,
  title,
  alignText = "center",
  enabled = true,
  style,
}: ITooltipProps) {
  const [active, setActive] = useState(false);

  return (
    <Popover
      toggleOnHover
      active={enabled ? active : false}
      setPopover={setActive}
      render={() => (
        <TooltipStyle style={style} textAlign={alignText}>
          {title}
        </TooltipStyle>
      )}
      clickToClose={false}
      placement={placement}
      toggleOnTargetClick={false}
      widthAtTarget={false}
      toggleFocus={false}
    >
      {children}
    </Popover>
  );
}

export default Tooltip;

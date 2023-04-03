import { styled } from "@stitches/react";
import { forwardRef, CSSProperties } from "react";

const Icon = styled("img", {
  position: "relative",
  borderRadius: "50%",
});

export interface IUserIconProps {
  URL: string;
  width?: number;
  height?: number;
  pointer?: boolean;
  style?: CSSProperties;
}
export const UserIcon = forwardRef<HTMLDivElement, IUserIconProps>(
  ({ URL, width = 52, height = 52, pointer, ...rest }, ref) => (
    <div ref={ref} {...rest}>
      <Icon width={width} height={height} src={URL} draggable={false}/>
    </div>
  ),
);

UserIcon.displayName = "UserIcon";

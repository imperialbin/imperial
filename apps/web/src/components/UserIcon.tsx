import { styled } from "@stitches/react";
import { forwardRef, CSSProperties } from "react";

const Icon = styled("img", {
  position: "relative",
  borderRadius: "50%",
  border: "1.5px solid $primary500",
});

export interface IUserIconProps {
  URL: string;
  size?: number;
  pointer?: boolean;
  style?: CSSProperties;
}

const UserIcon = forwardRef<HTMLImageElement, IUserIconProps>(
  ({ URL, size = 52, pointer, ...rest }, ref) => (
    <Icon ref={ref} width={size} height={size} src={URL} draggable={false} {...rest} />
  ),
);

export default UserIcon;

UserIcon.displayName = "UserIcon";

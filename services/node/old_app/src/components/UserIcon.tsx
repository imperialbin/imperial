import styled from "styled-components";
import Image from "next/image";
import { forwardRef, CSSProperties } from "react";

const Icon = styled(Image)<{ pointer?: boolean }>`
  position: relative;
  border-radius: 50%;
  cursor: ${({ pointer }) => (pointer ? "pointer" : "unset")};
`;

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
      <Icon
        width={width}
        pointer={pointer}
        height={height}
        src={URL}
        draggable={false}
      />
    </div>
  ),
);

UserIcon.displayName = "UserIcon";

import styled from "styled-components";
import Image from "next/image";
import { UserIconProps } from "../../types";

const Icon = styled(Image)<{ pointer?: boolean }>`
  position: relative;
  border-radius: 50%;
  cursor: ${({ pointer }) => (pointer ? "pointer" : "unset")};
`;

export const UserIcon = ({
  URL,
  width = 52,
  height = 52,
  pointer,
  margin,
}: UserIconProps): JSX.Element => (
  <div
    style={{
      margin: margin ? margin : "initial",
    }}
  >
    <Icon
      width={width}
      pointer={pointer}
      height={height}
      src={URL}
      draggable={false}
    />
  </div>
);

import styled from "styled-components";
import Image from "next/image";
import { UserIconProps } from "../../types";

const Icon = styled(Image)<{
  pointer?: boolean;
  margin?: string | null;
}>`
  border-radius: 50%;
  cursor: ${({ pointer }) => (pointer ? "pointer" : "unset")};
  margin: ${({ margin }) => (margin ? margin : "initial")};
`;

export const UserIcon = ({
  URL,
  width = 52,
  height = 52,
  pointer = false,
  margin = null,
}: UserIconProps): JSX.Element => (
  <Icon
    width={width}
    margin={margin}
    pointer={pointer}
    height={height}
    src={URL}
    draggable={false}
  />
);

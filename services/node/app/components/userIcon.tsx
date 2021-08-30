import styled from "styled-components";

import { UserIconProps } from "../types";

const Icon = styled.img`
  border-radius: 50%;
`;

export const UserIcon = ({
  URL,
  width = 45,
  height = 45,
  style,
}: UserIconProps): JSX.Element => (
  <Icon width={width} style={style} height={height} src={URL} />
);

import styled from "styled-components";
import { UserIconProps } from "../types";

const Icon = styled.img`
  border-radius: 50%;
`;

export const UserIcon = ({ URL }: UserIconProps): JSX.Element => (
  <Icon width={50} height={50} src={URL} />
);

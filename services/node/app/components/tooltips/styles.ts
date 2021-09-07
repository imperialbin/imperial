import styled from "styled-components";
import { ThemeForStupidProps } from "../../types";

export const ListContainer = styled.ul`
  list-style: none;
  padding: 0 5px;
`;

export const ListItem = styled.li`
  cursor: pointer;
  margin: 4px 0;
`;

export const Seperator = styled.span`
  display: flex;
  width: 100%;
  margin: 8px 0;
  opacity: 0.3;
  border-bottom: 1px solid;
`;
